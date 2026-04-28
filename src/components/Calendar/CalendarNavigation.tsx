import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthYear } from '../../utils/dateHelpers';

interface Props {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

export const CalendarNavigation: React.FC<Props> = ({ currentMonth, onPrev, onNext }) => {
  return (
    <div className="calendar-nav">
      <button className="nav-btn" onClick={onPrev} aria-label="Mês anterior">
        <ChevronLeft size={20} />
      </button>
      <h2 className="month-title">{formatMonthYear(currentMonth)}</h2>
      <button className="nav-btn" onClick={onNext} aria-label="Próximo mês">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
