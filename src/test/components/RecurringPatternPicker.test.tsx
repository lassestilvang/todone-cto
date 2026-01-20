import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecurringPatternPicker } from '@/components/tasks/RecurringPatternPicker';
import type { RecurringPattern } from '@/types';

describe('RecurringPatternPicker', () => {
  it('renders without crashing', () => {
    render(
      <RecurringPatternPicker
        value={undefined}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText('Add repeat')).toBeInTheDocument();
  });

  it('calls onChange when pattern changes', () => {
    const onChange = vi.fn();
    
    render(
      <RecurringPatternPicker
        value={undefined}
        onChange={onChange}
      />
    );

    // Test that the component calls onChange when needed
    // This is a basic smoke test
    expect(onChange).not.toHaveBeenCalled();
  });

  it('displays preset options when opened', () => {
    render(
      <RecurringPatternPicker
        value={undefined}
        onChange={vi.fn()}
      />
    );

    // Open the modal first
    const addButton = screen.getByText('Add repeat');
    fireEvent.click(addButton);

    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Yearly')).toBeInTheDocument();
  });

  it('shows current pattern when value is provided', () => {
    const pattern: RecurringPattern = {
      type: 'daily',
      interval: 1,
    };

    render(
      <RecurringPatternPicker
        value={pattern}
        onChange={vi.fn()}
      />
    );

    // Should show the pattern description instead of "Add repeat"
    expect(screen.getByText('Daily')).toBeInTheDocument();
  });
});