import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders DEVNET LIVE indicator', () => {
    render(<StatusBar />);
    expect(screen.getAllByText('DEVNET LIVE')[0]).toBeInTheDocument();
  });

  it('renders SNS REGISTRY label', () => {
    render(<StatusBar />);
    expect(screen.getAllByText(/SNS REGISTRY/i)[0]).toBeInTheDocument();
  });

  it('renders version number', () => {
    render(<StatusBar />);
    expect(screen.getAllByText('v1.0.0')[0]).toBeInTheDocument();
  });

  it('shows latency in ms after mount', async () => {
    render(<StatusBar />);
    await waitFor(() => {
      expect(screen.getAllByText(/\d+ms/)[0]).toBeInTheDocument();
    });
  });

  it('shows BLOCK label', () => {
    render(<StatusBar />);
    expect(screen.getAllByText(/BLOCK:/i)[0]).toBeInTheDocument();
  });

  it('shows RPC label', () => {
    render(<StatusBar />);
    expect(screen.getAllByText(/RPC:/i)[0]).toBeInTheDocument();
  });
});
