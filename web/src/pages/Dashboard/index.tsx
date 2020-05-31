import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';

import logoImg from '../../assets/logo.svg';

import { Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';
import api from '../../services/api';
import { Link } from 'react-router-dom';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  formattedHour: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [month, setMonth] = useState(new Date());

  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers ) => {
    if (modifiers.available && !modifiers.disabled) {
      setDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setMonth(month);
  }, []);

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: month.getFullYear(),
        month: month.getMonth() + 1,
      }
    }).then(response => {
      setMonthAvailability(response.data);
    });
  }, [month, user.id]);

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        }
      }).then(response =>{
        const formattedAppointments = response.data.map(appointment => {
          return {
            ...appointment,
            formattedHour: format(parseISO(appointment.date), 'HH:mm'),
          };
        });

        setAppointments(formattedAppointments);
      });
  }, [date]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = month.getFullYear();
        const selectedMonth = month.getMonth();

        return new Date(year, selectedMonth, monthDay.day);
      });

    return dates;
  }, [month, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(date, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [date]);

  const selectedWeekDay = useMemo(() => {
    return format(date, 'cccc', { locale: ptBR });
  }, [date]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    })
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    })
  }, [appointments]);
  
  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="gobarber"/>

          <Profile>
            <img src={user.avatar_url}alt={user.name} />

            <div>
              <span>Bem-vindo(a),</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>

          <p>
            {isToday(date) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(date) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            { morningAppointments.length === 0 && (
              <p>Nenhum agendamento nesse período.</p>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id} >
                <span>
                  <FiClock />
                  {appointment.formattedHour}
                </span>
  
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
  
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            { afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento nesse período.</p>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedHour}
                </span>
  
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
  
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker 
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            disabledDays={[
              { daysOfWeek: [0, 6] }, ...disabledDays] }
            modifiers={{
              available: { daysOfWeek: [1,2,3,4,5] }
            }}
            onMonthChange={handleMonthChange}
            selectedDays={date}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
}
export default Dashboard;
