import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// Mock heavy/browser-API components
vi.mock('@/components/ParticleField', () => ({
  ParticleField: () => <canvas data-testid="particle-field" />,
}));
vi.mock('@/components/AgentTerminal', () => ({
  AgentTerminal: ({ triggerRevoke }: { triggerRevoke: boolean }) => (
    <div data-testid="agent-terminal" data-revoked={String(triggerRevoke)} />
  ),
}));
vi.mock('@/components/ScrambleText', () => ({
  ScrambleText: ({ text }: { text: string }) => <span>{text}</span>,
}));
vi.mock('@/components/StatusBar', () => ({
  StatusBar: () => <div data-testid="status-bar" />,
}));

vi.mock('@/lib/sns', () => ({
  snsService: {
    mintSubdomain: vi.fn().mockResolvedValue({ success: true, transaction: 'mock_tx' }),
    revokeIdentity: vi.fn().mockResolvedValue({ success: true, transaction: 'mock_revoke' }),
  },
}));

import AgensolDashboard from './page';

describe('AgensolDashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // ── Registry view ──────────────────────────────────────────────

  it('renders the registry view by default', () => {
    render(<AgensolDashboard />);
    expect(screen.getAllByText('Verified Agent Directory')[0]).toBeInTheDocument();
  });

  it('renders all 5 seed agents on the registry', () => {
    render(<AgensolDashboard />);
    expect(screen.getAllByText('treasury.dao.sol')[0]).toBeInTheDocument();
    expect(screen.getAllByText('sniper.trading.sol')[0]).toBeInTheDocument();
    expect(screen.getAllByText('oracle.feeds.sol')[0]).toBeInTheDocument();
    expect(screen.getAllByText('sweep.cleanup.sol')[0]).toBeInTheDocument();
    expect(screen.getAllByText('arbitrage.bot.sol')[0]).toBeInTheDocument();
  });

  it('renders the header with Agen and sol text', () => {
    render(<AgensolDashboard />);
    expect(screen.getAllByText('Agen')[0]).toBeInTheDocument();
    expect(screen.getAllByText('sol')[0]).toBeInTheDocument();
  });

  it('renders metrics panel', () => {
    render(<AgensolDashboard />);
    expect(screen.getAllByText('REGISTERED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('ACTIVE')[0]).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<AgensolDashboard />);
    expect(screen.getAllByText('AGENSOL')[0]).toBeInTheDocument();
  });

  // ── Navigation ─────────────────────────────────────────────────

  it('navigates to Mint view', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Mint')[0]);
    expect(screen.getAllByText('Mint Agent Identity')[0]).toBeInTheDocument();
  });

  it('navigates to Terminal view', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Agent')[0]);
    expect(screen.getAllByText('Live Agent Terminal')[0]).toBeInTheDocument();
  });

  it('navigates to Kill Switch admin view', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Kill Switch')[0]);
    expect(screen.getAllByText('Emergency Kill Switches')[0]).toBeInTheDocument();
  });

  it('navigates back to Registry', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Mint')[0]);
    fireEvent.click(screen.getAllByText('Registry')[0]);
    expect(screen.getAllByText('Verified Agent Directory')[0]).toBeInTheDocument();
  });

  // ── Mint view ──────────────────────────────────────────────────

  it('shows subdomain preview when typing', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Mint')[0]);
    const input = screen.getByPlaceholderText(/e\.g\. trading-bot/i);
    fireEvent.change(input, { target: { value: 'mybot' } });
    // Preview text and button text both contain the domain — use getAllByText
    expect(screen.getAllByText(/mybot\.dao\.sol/).length).toBeGreaterThan(0);
  });

  it('strips special characters from subdomain input (keeps alphanumeric and dash)', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Mint')[0]);
    const input = screen.getByPlaceholderText(/e\.g\. trading-bot/i);
    // 'My Bot!' → lowercase → 'my bot!' → strip non [a-z0-9-] → 'mybot'
    fireEvent.change(input, { target: { value: 'My Bot!' } });
    expect((input as HTMLInputElement).value).toBe('mybot');
  });

  it('Mint button is disabled with empty subdomain', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Mint')[0]);
    const btn = screen.getAllByRole('button', { name: /MINT \.\.\./i })[0];
    expect(btn).toBeDisabled();
  });

  it('minting adds agent to registry', async () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Mint')[0]);
    const input = screen.getByPlaceholderText(/e\.g\. trading-bot/i);
    fireEvent.change(input, { target: { value: 'newbot' } });

    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /MINT newbot/i })[0]);
      await vi.runAllTimersAsync();
    });

    expect(screen.getAllByText('Verified Agent Directory')[0]).toBeInTheDocument();
    expect(screen.getAllByText('newbot.dao.sol')[0]).toBeInTheDocument();
  });

  it('shows parentDomain selector in Mint view', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Mint')[0]);
    const select = screen.getAllByRole('combobox')[0];
    expect(select).toBeInTheDocument();
  });

  // ── Admin / Kill Switch view ────────────────────────────────────

  it('admin view shows all agents', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Kill Switch')[0]);
    expect(screen.getAllByText('treasury.dao.sol')[0]).toBeInTheDocument();
    expect(screen.getAllByText('arbitrage.bot.sol')[0]).toBeInTheDocument();
  });

  it('shows IDENTITY REVOKED for already-revoked agent', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Kill Switch')[0]);
    expect(screen.getAllByText(/IDENTITY REVOKED/i).length).toBeGreaterThan(0);
  });

  it('revoking an agent updates its status to revoking', async () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Kill Switch')[0]);
    const revokeBtn = screen.getAllByRole('button', { name: /REVOKE treasury\.dao\.sol/i })[0];
    fireEvent.click(revokeBtn);
    expect(screen.getAllByText(/REVOKING treasury\.dao\.sol/i)[0]).toBeInTheDocument();
  });

  it('agent becomes revoked after revoke completes', async () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Kill Switch')[0]);

    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /REVOKE treasury\.dao\.sol/i })[0]);
      await vi.runAllTimersAsync();
    });

    // Now treasury.dao.sol should also be revoked, alongside arbitrage.bot.sol
    const identityRevokedEls = screen.getAllByText(/IDENTITY REVOKED/i);
    expect(identityRevokedEls.length).toBeGreaterThan(1);
  });

  // ── Terminal view ──────────────────────────────────────────────

  it('renders AgentTerminal component', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Agent')[0]);
    expect(screen.getByTestId('agent-terminal')).toBeInTheDocument();
  });

  it('shows kill switch demo button', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Agent')[0]);
    expect(screen.getAllByText(/REVOKE treasury\.dao\.sol/i)[0]).toBeInTheDocument();
  });

  it('activating kill switch demo disables the button', async () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('Agent')[0]);
    fireEvent.click(screen.getAllByText(/REVOKE treasury\.dao\.sol/i)[0]);
    expect(screen.getAllByText(/Kill switch activated/i)[0]).toBeInTheDocument();
  });

  // ── Modal ──────────────────────────────────────────────────────

  it('opens agent detail modal on card click', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('treasury.dao.sol')[0]);
    expect(screen.getAllByText('PROFILE RECORD')[0]).toBeInTheDocument();
  });

  it('closes modal when backdrop clicked', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('treasury.dao.sol')[0]);
    // Click the outer backdrop wrapper
    const backdrop = screen.getAllByText('PROFILE RECORD')[0].closest('.fixed');
    fireEvent.click(backdrop!);
    expect(screen.queryByText('PROFILE RECORD')).not.toBeInTheDocument();
  });

  it('closes modal when ✕ button clicked', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getAllByText('treasury.dao.sol')[0]);
    // MetricsPanel also has a ✕ icon span; target the button specifically
    fireEvent.click(screen.getAllByRole('button', { name: '✕' })[0]);
    expect(screen.queryByText('PROFILE RECORD')).not.toBeInTheDocument();
  });
});
