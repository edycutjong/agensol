import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders AGENSOL brand name', () => {
    render(<Footer />);
    expect(screen.getAllByText('AGENSOL')[0]).toBeInTheDocument();
  });

  it('renders hackathon attribution', () => {
    render(<Footer />);
    expect(screen.getAllByText(/Colosseum Frontier 2026/i)[0]).toBeInTheDocument();
  });

  it('renders SNS package name', () => {
    render(<Footer />);
    expect(screen.getAllByText(/@bonfida\/spl-name-service/i)[0]).toBeInTheDocument();
  });

  it('renders tagline', () => {
    render(<Footer />);
    expect(screen.getAllByText(/AI Agent Identity Registry on SNS/i)[0]).toBeInTheDocument();
  });
});
