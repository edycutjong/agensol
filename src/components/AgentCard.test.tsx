import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentCard } from './AgentCard';
import type { AgentData } from '@/lib/types';

const ACTIVE_AGENT: AgentData = {
  domain: 'treasury.dao.sol',
  type: 'DeFi Executor',
  owner: '7X8mRjk...dFaB',
  status: 'active',
  registeredAt: '2026-05-06T09:00:00Z',
  lastHeartbeat: '12s ago',
  config: {
    max_spend: '1,000 USDC',
    allowed_protocols: ['Jupiter', 'Meteora'],
    heartbeat_interval: '5m',
    system_prompt_hash: 'abc123',
  },
};

const REVOKED_AGENT: AgentData = {
  ...ACTIVE_AGENT,
  domain: 'arbitrage.bot.sol',
  status: 'revoked',
  owner: 'Burn1111...1111',
};

const REVOKING_AGENT: AgentData = {
  ...ACTIVE_AGENT,
  domain: 'sniper.trading.sol',
  status: 'revoking',
};

describe('AgentCard', () => {
  it('renders agent domain', () => {
    render(<AgentCard agent={ACTIVE_AGENT} index={0} />);
    expect(screen.getAllByText('treasury.dao.sol')[0]).toBeInTheDocument();
  });

  it('renders agent type', () => {
    render(<AgentCard agent={ACTIVE_AGENT} index={0} />);
    expect(screen.getAllByText('DeFi Executor')[0]).toBeInTheDocument();
  });

  it('renders agent owner', () => {
    render(<AgentCard agent={ACTIVE_AGENT} index={0} />);
    expect(screen.getAllByText('7X8mRjk...dFaB')[0]).toBeInTheDocument();
  });

  it('shows active status pill', () => {
    render(<AgentCard agent={ACTIVE_AGENT} index={0} />);
    expect(screen.getAllByText('active').length).toBeGreaterThan(0);
  });

  it('shows revoked status for revoked agent', () => {
    render(<AgentCard agent={REVOKED_AGENT} index={0} />);
    expect(screen.getAllByText('revoked').length).toBeGreaterThan(0);
  });

  it('shows revoking status', () => {
    render(<AgentCard agent={REVOKING_AGENT} index={0} />);
    expect(screen.getAllByText('revoking').length).toBeGreaterThan(0);
  });

  it('applies grayscale class for revoked agent', () => {
    const { container } = render(<AgentCard agent={REVOKED_AGENT} index={0} />);
    expect(container.firstChild).toHaveClass('grayscale');
  });

  it('shows max_spend and heartbeat_interval', () => {
    render(<AgentCard agent={ACTIVE_AGENT} index={0} />);
    expect(screen.getAllByText('1,000 USDC')[0]).toBeInTheDocument();
    expect(screen.getAllByText('5m')[0]).toBeInTheDocument();
  });

  it('profile record is hidden by default', () => {
    render(<AgentCard agent={ACTIVE_AGENT} index={0} />);
    expect(screen.queryByText('SNS PROFILE RECORD')).not.toBeInTheDocument();
  });

  it('expands profile record when toggle button clicked', () => {
    render(<AgentCard agent={ACTIVE_AGENT} index={0} />);
    fireEvent.click(screen.getAllByText(/SHOW PROFILE RECORD/i)[0]);
    expect(screen.getAllByText('SNS PROFILE RECORD')[0]).toBeInTheDocument();
  });

  it('collapses profile record when toggle clicked again', () => {
    render(<AgentCard agent={ACTIVE_AGENT} index={0} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('SNS PROFILE RECORD')).not.toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', () => {
    const onSelect = vi.fn();
    const { container } = render(<AgentCard agent={ACTIVE_AGENT} index={0} onSelect={onSelect} />);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onSelect).toHaveBeenCalledWith(ACTIVE_AGENT);
  });

  it('toggle button click does not trigger onSelect', () => {
    const onSelect = vi.fn();
    render(<AgentCard agent={ACTIVE_AGENT} index={0} onSelect={onSelect} />);
    fireEvent.click(screen.getAllByText(/SHOW PROFILE RECORD/i)[0]);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('uses fallback robot emoji for unknown agent type', () => {
    const agent = { ...ACTIVE_AGENT, type: 'Unknown' };
    render(<AgentCard agent={agent} index={0} />);
    expect(screen.getAllByText('🤖')[0]).toBeInTheDocument();
  });

  it('uses correct icon for known type', () => {
    render(<AgentCard agent={ACTIVE_AGENT} index={0} />);
    expect(screen.getAllByText('⚡')[0]).toBeInTheDocument();
  });

  it('renders without onSelect prop', () => {
    expect(() => render(<AgentCard agent={ACTIVE_AGENT} index={0} />)).not.toThrow();
  });
});
