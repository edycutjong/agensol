import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ScrambleText } from './ScrambleText';

describe('ScrambleText', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the final text immediately as fallback', () => {
    render(<ScrambleText text="Agensol" />);
    expect(screen.getByText('Agensol')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(<ScrambleText text="Hello" className="neon-text" />);
    expect(container.querySelector('.neon-text')).toBeInTheDocument();
  });

  it('eventually resolves to correct text after animation', async () => {
    vi.useFakeTimers();
    render(<ScrambleText text="Done" delay={0} />);
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('respects delay before starting animation', async () => {
    vi.useFakeTimers();
    render(<ScrambleText text="Hi" delay={500} />);
    // Before delay elapses the text is still the initial value
    expect(screen.getByText('Hi')).toBeInTheDocument();
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(screen.getByText('Hi')).toBeInTheDocument();
  });

  it('renders span element', () => {
    const { container } = render(<ScrambleText text="Test" />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });
});
