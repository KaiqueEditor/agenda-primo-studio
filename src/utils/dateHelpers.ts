import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addMonths,
  subMonths,
  differenceInDays,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { type Projeto, type CalendarEvent, type FaseType, TEAM_MEMBERS } from '../types';

export const formatDate = (date: Date, fmt: string = 'dd/MM/yyyy'): string => {
  return format(date, fmt, { locale: ptBR });
};

export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: ptBR });
};

export const getCalendarDays = (month: Date): Date[] => {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
};

export const isCurrentMonth = (day: Date, month: Date): boolean => {
  return isSameMonth(day, month);
};

export const isToday = (day: Date): boolean => {
  return isSameDay(day, new Date());
};

export const getNextMonth = (date: Date): Date => addMonths(date, 1);
export const getPrevMonth = (date: Date): Date => subMonths(date, 1);

export const getEventsForDay = (
  projetos: Projeto[],
  day: Date,
  fasesFilter: FaseType[]
): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  projetos.forEach((projeto) => {
    const fases = projeto.fases;

    // Check each fase
    (['gravacao', 'edicao'] as const).forEach((fase) => {
      const periodo = fases[fase];
      if (!periodo || !periodo.inicio || !periodo.fim) return;
      if (!fasesFilter.includes(fase)) return;

      if (isWithinInterval(day, { start: periodo.inicio, end: periodo.fim })) {
        events.push({
          projeto,
          fase,
          date: day,
          isStart: isSameDay(day, periodo.inicio),
          isEnd: isSameDay(day, periodo.fim),
          isSingle: isSameDay(periodo.inicio, periodo.fim),
        });
      }
    });

    // Publication date
    if (fasesFilter.includes('publicacao') && fases.publicacao?.data && isSameDay(day, fases.publicacao.data)) {
      events.push({
        projeto,
        fase: 'publicacao',
        date: day,
        isStart: true,
        isEnd: true,
        isSingle: true,
      });
    }
  });

  return events;
};

export const getProjectProgress = (projeto: Projeto): number => {
  const now = new Date();
  const phases: { start: Date; end: Date }[] = [];

  if (projeto.fases.gravacao?.inicio && projeto.fases.gravacao?.fim) {
    phases.push({ start: projeto.fases.gravacao.inicio, end: projeto.fases.gravacao.fim });
  }
  if (projeto.fases.edicao?.inicio && projeto.fases.edicao?.fim) {
    phases.push({ start: projeto.fases.edicao.inicio, end: projeto.fases.edicao.fim });
  }
  if (projeto.fases.publicacao?.data) {
    phases.push({ start: projeto.fases.publicacao.data, end: projeto.fases.publicacao.data });
  }

  if (phases.length === 0) return 0;

  const earliest = phases.reduce(
    (min, p) => (p.start < min ? p.start : min),
    phases[0].start
  );
  const latest = phases.reduce(
    (max, p) => (p.end > max ? p.end : max),
    phases[0].end
  );

  const totalDays = differenceInDays(latest, earliest) || 1;
  const elapsed = differenceInDays(now, earliest);

  if (elapsed <= 0) return 0;
  if (elapsed >= totalDays) return 100;
  return Math.round((elapsed / totalDays) * 100);
};

export const getCurrentFase = (projeto: Projeto): FaseType | null => {
  const now = new Date();

  if (
    projeto.fases.gravacao?.inicio && projeto.fases.gravacao?.fim &&
    isWithinInterval(now, { start: projeto.fases.gravacao.inicio, end: projeto.fases.gravacao.fim })
  ) {
    return 'gravacao';
  }
  if (
    projeto.fases.edicao?.inicio && projeto.fases.edicao?.fim &&
    isWithinInterval(now, { start: projeto.fases.edicao.inicio, end: projeto.fases.edicao.fim })
  ) {
    return 'edicao';
  }
  if (projeto.fases.publicacao?.data && isSameDay(now, projeto.fases.publicacao.data)) {
    return 'publicacao';
  }

  return null;
};

export const detectConflicts = (
  projetos: Projeto[]
): { projeto1: Projeto; projeto2: Projeto; casting: string; periodo: string; isTeam?: boolean }[] => {
  const conflicts: { projeto1: Projeto; projeto2: Projeto; casting: string; periodo: string; isTeam?: boolean }[] = [];

  const checkOverlap = (
    p1: Projeto,
    p2: Projeto,
    fase: FaseType,
    people: string[],
    isTeam: boolean
  ) => {
    const p1Fase = p1.fases[fase];
    const p2Fase = p2.fases[fase];
    if (fase === 'publicacao' || !p1Fase || !p2Fase) return;
    
    // cast to FasePeriodo
    const f1 = p1Fase as {inicio?: Date; fim?: Date};
    const f2 = p2Fase as {inicio?: Date; fim?: Date};

    if (f1.inicio && f1.fim && f2.inicio && f2.fim) {
      if (f1.inicio <= f2.fim && f2.inicio <= f1.fim) {
        people.forEach((person) => {
          conflicts.push({
            projeto1: p1,
            projeto2: p2,
            casting: person,
            isTeam,
            periodo: `${formatDate(
              f1.inicio! > f2.inicio! ? f1.inicio! : f2.inicio!,
              'dd/MM'
            )} - ${formatDate(f1.fim! < f2.fim! ? f1.fim! : f2.fim!, 'dd/MM')}`,
          });
        });
      }
    }
  };

  for (let i = 0; i < projetos.length; i++) {
    for (let j = i + 1; j < projetos.length; j++) {
      const p1 = projetos[i];
      const p2 = projetos[j];

      // CASTING CONFLICTS (we only checked gravacao before, let's keep it that way for casting)
      const commonCasting = p1.casting.filter((c) => p2.casting.includes(c));
      if (commonCasting.length > 0) {
        checkOverlap(p1, p2, 'gravacao', commonCasting, false);
      }

      // TEAM CONFLICTS (check all phases)
      const t1 = p1.responsavel || [];
      const t2 = p2.responsavel || [];
      const commonTeam = t1.filter((c) => t2.includes(c));
      
      if (commonTeam.length > 0) {
        const strictTeam = commonTeam.filter((name) => {
          const memberDef = TEAM_MEMBERS.find(m => m.name === name);
          // If member is not found, assume they can't multitask to be safe, or just skip? 
          // Let's assume if they are added manually, they are strict unless they are producers.
          return memberDef ? !memberDef.canMultitask : true; 
        });

        if (strictTeam.length > 0) {
          checkOverlap(p1, p2, 'gravacao', strictTeam, true);
          checkOverlap(p1, p2, 'edicao', strictTeam, true);
        }
      }
    }
  }

  // Deduplicate conflicts
  const uniqueConflicts = conflicts.filter((c, index, self) => 
    index === self.findIndex((t) => (
      t.projeto1.id === c.projeto1.id && t.projeto2.id === c.projeto2.id && t.casting === c.casting && t.periodo === c.periodo
    ))
  );

  return uniqueConflicts;
};

export const getWeekDayNames = (): string[] => {
  return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
};
