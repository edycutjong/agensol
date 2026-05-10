import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KillSwitch } from './KillSwitch';

describe('KillSwitch', () => {
  it('shows IDENTITY REVOKED when not active and not revoking', () => {
    render(<KillSwitch domain="bot.sol" isActive={false} isRevoking={false} onRevoke={vi.fn()} />);
    expect(screen.getAllByText(/IDENTITY REVOKED/i)[0]).toBeInTheDocument();
  });

  it('does not render a button when already revoked', () => {
    render(<KillSwitch domain="bot.sol" isActive={false} isRevoking={false} onRevoke={vi.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows revoke button for active agent', () => {
    render(<KillSwitch domain="bot.sol" isActive={true} isRevoking={false} onRevoke={vi.fn()} />);
    expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/REVOKE bot\.sol/i)[0]).toBeInTheDocument();
  });

  it('calls onRevoke when button clicked', () => {
    const onRevoke = vi.fn();
    render(<KillSwitch domain="bot.sol" isActive={true} isRevoking={false} onRevoke={onRevoke} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onRevoke).toHaveBeenCalledOnce();
  });

  it('shows revoking state with spinner text', () => {
    render(<KillSwitch domain="bot.sol" isActive={true} isRevoking={true} onRevoke={vi.fn()} />);
    expect(screen.getAllByText(/REVOKING bot\.sol/i)[0]).toBeInTheDocument();
  });

  it('disables button while revoking', () => {
    render(<KillSwitch domain="bot.sol" isActive={true} isRevoking={true} onRevoke={vi.fn()} />);
    expect(screen.getAllByRole('button')[0]).toBeDisabled();
  });

  it('does not call onRevoke when button is disabled during revoking', () => {
    const onRevoke = vi.fn();
    render(<KillSwitch domain="bot.sol" isActive={true} isRevoking={true} onRevoke={onRevoke} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onRevoke).not.toHaveBeenCalled();
  });
});
