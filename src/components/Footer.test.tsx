import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders AGENSOL brand name', () => {
    render(<Footer />);
    expect(screen.getByText('AGENSOL')).toBeInTheDocument();
  });

  it('renders hackathon attribution', () => {
    render(<Footer />);
    expect(screen.getByText(/Colosseum Frontier 2026/i)).toBeInTheDocument();
  });

  it('renders SNS package name', () => {
    render(<Footer />);
    expect(screen.getByText(/@bonfida\/spl-name-service/i)).toBeInTheDocument();
  });

  it('renders tagline', () => {
    render(<Footer />);
    expect(screen.getByText(/AI Agent Identity Registry on SNS/i)).toBeInTheDocument();
  });
});
