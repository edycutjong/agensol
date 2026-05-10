import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders DEVNET LIVE indicator', () => {
    render(<StatusBar />);
    expect(screen.getByText('DEVNET LIVE')).toBeInTheDocument();
  });

  it('renders SNS REGISTRY label', () => {
    render(<StatusBar />);
    expect(screen.getByText(/SNS REGISTRY/i)).toBeInTheDocument();
  });

  it('renders version number', () => {
    render(<StatusBar />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('shows latency in ms after mount', () => {
    render(<StatusBar />);
    expect(screen.getByText(/\d+ms/)).toBeInTheDocument();
  });

  it('shows BLOCK label', () => {
    render(<StatusBar />);
    expect(screen.getByText(/BLOCK:/i)).toBeInTheDocument();
  });

  it('shows RPC label', () => {
    render(<StatusBar />);
    expect(screen.getByText(/RPC:/i)).toBeInTheDocument();
  });
});
