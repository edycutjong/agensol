import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KillSwitch } from './KillSwitch';

describe('KillSwitch', () => {
  it('shows IDENTITY REVOKED when not active and not revoking', () => {
    render(<KillSwitch domain="bot.sol" isActive={false} isRevoking={false} onRevoke={vi.fn()} />);
    expect(screen.getByText(/IDENTITY REVOKED/i)).toBeInTheDocument();
  });

  it('does not render a button when already revoked', () => {
    render(<KillSwitch domain="bot.sol" isActive={false} isRevoking={false} onRevoke={vi.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows revoke button for active agent', () => {
    render(<KillSwitch domain="bot.sol" isActive={true} isRevoking={false} onRevoke={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText(/REVOKE bot\.sol/i)).toBeInTheDocument();
  });

  it('calls onRevoke when button clicked', () => {
    const onRevoke = vi.fn();
    render(<KillSwitch domain="bot.sol" isActive={true} isRevoking={false} onRevoke={onRevoke} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onRevoke).toHaveBeenCalledOnce();
  });

  it('shows revoking state with spinner text', () => {
    render(<KillSwitch domain="bot.sol" isActive={true} isRevoking={true} onRevoke={vi.fn()} />);
    expect(screen.getByText(/REVOKING bot\.sol/i)).toBeInTheDocument();
  });

  it('disables button while revoking', () => {
    render(<KillSwitch domain="bot.sol" isActive={true} isRevoking={true} onRevoke={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onRevoke when button is disabled during revoking', () => {
    const onRevoke = vi.fn();
    render(<KillSwitch domain="bot.sol" isActive={true} isRevoking={true} onRevoke={onRevoke} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onRevoke).not.toHaveBeenCalled();
  });
});
