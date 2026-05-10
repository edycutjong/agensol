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
    expect(screen.getByText('Verified Agent Directory')).toBeInTheDocument();
  });

  it('renders all 5 seed agents on the registry', () => {
    render(<AgensolDashboard />);
    expect(screen.getByText('treasury.dao.sol')).toBeInTheDocument();
    expect(screen.getByText('sniper.trading.sol')).toBeInTheDocument();
    expect(screen.getByText('oracle.feeds.sol')).toBeInTheDocument();
    expect(screen.getByText('sweep.cleanup.sol')).toBeInTheDocument();
    expect(screen.getByText('arbitrage.bot.sol')).toBeInTheDocument();
  });

  it('renders the header with Agen and sol text', () => {
    render(<AgensolDashboard />);
    expect(screen.getByText('Agen')).toBeInTheDocument();
    expect(screen.getByText('sol')).toBeInTheDocument();
  });

  it('renders metrics panel', () => {
    render(<AgensolDashboard />);
    expect(screen.getByText('REGISTERED')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<AgensolDashboard />);
    expect(screen.getByText('AGENSOL')).toBeInTheDocument();
  });

  // ── Navigation ─────────────────────────────────────────────────

  it('navigates to Mint view', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Mint'));
    expect(screen.getByText('Mint Agent Identity')).toBeInTheDocument();
  });

  it('navigates to Terminal view', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Agent'));
    expect(screen.getByText('Live Agent Terminal')).toBeInTheDocument();
  });

  it('navigates to Kill Switch admin view', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Kill Switch'));
    expect(screen.getByText('Emergency Kill Switches')).toBeInTheDocument();
  });

  it('navigates back to Registry', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Mint'));
    fireEvent.click(screen.getByText('Registry'));
    expect(screen.getByText('Verified Agent Directory')).toBeInTheDocument();
  });

  // ── Mint view ──────────────────────────────────────────────────

  it('shows subdomain preview when typing', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Mint'));
    const input = screen.getByPlaceholderText(/e\.g\. trading-bot/i);
    fireEvent.change(input, { target: { value: 'mybot' } });
    // Preview text and button text both contain the domain — use getAllByText
    expect(screen.getAllByText(/mybot\.dao\.sol/).length).toBeGreaterThan(0);
  });

  it('strips special characters from subdomain input (keeps alphanumeric and dash)', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Mint'));
    const input = screen.getByPlaceholderText(/e\.g\. trading-bot/i);
    // 'My Bot!' → lowercase → 'my bot!' → strip non [a-z0-9-] → 'mybot'
    fireEvent.change(input, { target: { value: 'My Bot!' } });
    expect((input as HTMLInputElement).value).toBe('mybot');
  });

  it('Mint button is disabled with empty subdomain', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Mint'));
    const btn = screen.getByRole('button', { name: /MINT \.\.\./i });
    expect(btn).toBeDisabled();
  });

  it('minting adds agent to registry', async () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Mint'));
    const input = screen.getByPlaceholderText(/e\.g\. trading-bot/i);
    fireEvent.change(input, { target: { value: 'newbot' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /MINT newbot/i }));
      await vi.runAllTimersAsync();
    });

    expect(screen.getByText('Verified Agent Directory')).toBeInTheDocument();
    expect(screen.getByText('newbot.dao.sol')).toBeInTheDocument();
  });

  it('shows parentDomain selector in Mint view', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Mint'));
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  // ── Admin / Kill Switch view ────────────────────────────────────

  it('admin view shows all agents', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Kill Switch'));
    expect(screen.getByText('treasury.dao.sol')).toBeInTheDocument();
    expect(screen.getByText('arbitrage.bot.sol')).toBeInTheDocument();
  });

  it('shows IDENTITY REVOKED for already-revoked agent', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Kill Switch'));
    expect(screen.getAllByText(/IDENTITY REVOKED/i).length).toBeGreaterThan(0);
  });

  it('revoking an agent updates its status to revoking', async () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Kill Switch'));
    const revokeBtn = screen.getByRole('button', { name: /REVOKE treasury\.dao\.sol/i });
    fireEvent.click(revokeBtn);
    expect(screen.getByText(/REVOKING treasury\.dao\.sol/i)).toBeInTheDocument();
  });

  it('agent becomes revoked after revoke completes', async () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Kill Switch'));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /REVOKE treasury\.dao\.sol/i }));
      await vi.runAllTimersAsync();
    });

    // Now treasury.dao.sol should also be revoked, alongside arbitrage.bot.sol
    const identityRevokedEls = screen.getAllByText(/IDENTITY REVOKED/i);
    expect(identityRevokedEls.length).toBeGreaterThan(1);
  });

  // ── Terminal view ──────────────────────────────────────────────

  it('renders AgentTerminal component', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Agent'));
    expect(screen.getByTestId('agent-terminal')).toBeInTheDocument();
  });

  it('shows kill switch demo button', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Agent'));
    expect(screen.getByText(/REVOKE treasury\.dao\.sol/i)).toBeInTheDocument();
  });

  it('activating kill switch demo disables the button', async () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('Agent'));
    fireEvent.click(screen.getByText(/REVOKE treasury\.dao\.sol/i));
    expect(screen.getByText(/Kill switch activated/i)).toBeInTheDocument();
  });

  // ── Modal ──────────────────────────────────────────────────────

  it('opens agent detail modal on card click', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('treasury.dao.sol'));
    expect(screen.getByText('PROFILE RECORD')).toBeInTheDocument();
  });

  it('closes modal when backdrop clicked', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('treasury.dao.sol'));
    // Click the outer backdrop wrapper
    const backdrop = screen.getByText('PROFILE RECORD').closest('.fixed');
    fireEvent.click(backdrop!);
    expect(screen.queryByText('PROFILE RECORD')).not.toBeInTheDocument();
  });

  it('closes modal when ✕ button clicked', () => {
    render(<AgensolDashboard />);
    fireEvent.click(screen.getByText('treasury.dao.sol'));
    // MetricsPanel also has a ✕ icon span; target the button specifically
    fireEvent.click(screen.getByRole('button', { name: '✕' }));
    expect(screen.queryByText('PROFILE RECORD')).not.toBeInTheDocument();
  });
});
