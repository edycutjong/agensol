import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MetricsPanel } from './MetricsPanel';

describe('MetricsPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders four metric cards', () => {
    render(<MetricsPanel activeCount={3} revokedCount={1} totalCount={5} />);
    expect(screen.getByText('REGISTERED')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('REVOKED')).toBeInTheDocument();
    expect(screen.getByText('SDK FEATURES')).toBeInTheDocument();
  });

  it('displays totalCount as registered value', () => {
    render(<MetricsPanel activeCount={3} revokedCount={1} totalCount={7} />);
    const values = screen.getAllByText('7');
    expect(values.length).toBeGreaterThan(0);
  });

  it('displays activeCount', () => {
    render(<MetricsPanel activeCount={4} revokedCount={1} totalCount={6} />);
    const values = screen.getAllByText('4');
    expect(values.length).toBeGreaterThan(0);
  });

  it('displays revokedCount', () => {
    render(<MetricsPanel activeCount={3} revokedCount={2} totalCount={6} />);
    const values = screen.getAllByText('2');
    expect(values.length).toBeGreaterThan(0);
  });

  it('always shows 5 SDK features', () => {
    render(<MetricsPanel activeCount={0} revokedCount={0} totalCount={0} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('becomes animated after 300ms', () => {
    const { container } = render(<MetricsPanel activeCount={1} revokedCount={0} totalCount={1} />);
    const cards = container.querySelectorAll('.opacity-0');
    expect(cards.length).toBeGreaterThan(0);
    act(() => { vi.advanceTimersByTime(300); });
    const animatedCards = container.querySelectorAll('.animate-fade-in-up');
    expect(animatedCards.length).toBeGreaterThan(0);
  });

  it('renders suffix labels', () => {
    render(<MetricsPanel activeCount={3} revokedCount={1} totalCount={5} />);
    expect(screen.getByText('agents')).toBeInTheDocument();
    expect(screen.getByText('verified')).toBeInTheDocument();
    expect(screen.getByText('killed')).toBeInTheDocument();
    expect(screen.getByText('/5')).toBeInTheDocument();
  });
});
