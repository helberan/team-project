import { Container, Form, Button, Modal } from 'react-bootstrap';
import './BookingForm.css';
import services from '../../assets/services.json';
import { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';

interface FormInputData {
  id: number;
  name: string;
  surname: string;
  email: string;
  telephone: string;
  service: string;
  date: string;
  time: string;
}

export const BookingForm = () => {
  const d = new Date();
  const today = d.toISOString().split('T')[0];
  const maxDate = d.getFullYear() + 1 + '-01-01';

  const [inputData, setInputData] = useState<FormInputData>({
    id: 0,
    name: '',
    surname: '',
    email: '',
    telephone: '',
    service: '',
    date: '',
    time: '',
  });

  const [showModal, setShowModal] = useState(false);

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedDateTime = new Date(
      inputData.date + 'T' + inputData.time + ':00',
    );
    const currentDateTime = new Date();

    // Kontrola, zda vybrané datum a čas jsou v budoucnosti
    if (selectedDateTime <= currentDateTime) {
      return; // Pokud je vybraný čas menší nebo roven aktuálnímu času, nebudeme formulář odesílat
    }
    try {
      const response = await axios.post(
        'http://localhost:3001/bookings',
        inputData,
      );
      console.log('Booking submitted', response.data);
      setShowModal(true); //
      localStorage.setItem('formSubmitted', 'true');
      setFormSubmitted(true);
      setInputData({
        id: 0,
        name: '',
        surname: '',
        email: '',
        telephone: '',
        service: '',
        date: '',
        time: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const generateHoursOptions = () => {
    const currentHour = d.getHours();
    const availableHours = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];
    if (inputData.date === today) {
      return availableHours.filter(
        (hour) => parseInt(hour.substr(0, 2)) > currentHour,
      );
    }

    return availableHours;
  };

  const isDateDisabled = () => {
    const currentHour = d.getHours();
    return inputData.date === today && currentHour >= 18; // Disable today if current hour is 18 or later
  };

  useEffect(() => {
    if (localStorage.getItem('formSubmitted') === 'true') {
      setFormSubmitted(true);
      setTimeout(() => {
        localStorage.removeItem('formSubmitted');
        setFormSubmitted(false);
      }, 5000);
    }
  }, []);

  //server endpoint check
  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:3001/bookings').then(
        (res) => res.json(),
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [formSubmitted]);

  return (
    <Container className='mt-5 form-container'>
      {/*Potvrzení nahoře na stránce po odeslání rezervace */}
      {localStorage.getItem('formSubmitted') && (
        <div className='info-message'>Formulář byl úspěšně odeslán!</div>
      )}

      {/*Modal - vyskakovací okýnko, zobrazí se po odeslání rezervace přes obsah stránky*/}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rezervace potvrzena</Modal.Title>
        </Modal.Header>
        <Modal.Body>Budeme se těšit na Vaši návštěvu!</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Zavřít
          </Button>
        </Modal.Footer>
      </Modal>

      <h1>Objednat se</h1>

      {/*<form action='https://formsubmit.co/physioreact@seznam.cz' method='POST'></form>*/}

      <Form className='mt-5' onSubmit={handleSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='name'>Křestní jméno</Form.Label>
          <Form.Control
            type='text'
            placeholder='Křestní jméno'
            id='name'
            name='name'
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='surname'>Příjmení</Form.Label>
          <Form.Control
            type='text'
            placeholder='Příjmení'
            id='surname'
            name='surname'
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>E-mail</Form.Label>
          <Form.Control
            type='email'
            placeholder='E-mailová adresa'
            id='email'
            name='email'
            onChange={handleChange}
            required
          />
          <Form.Text className='text-muted'>
            Váš e-mail nebudeme s nikým sdílet.
          </Form.Text>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='telephone'>Telefonní číslo</Form.Label>
          <Form.Control
            type='tel'
            placeholder='Telefonní číslo'
            id='telephone'
            name='telephone'
            onChange={handleChange}
            required
          />
          <Form.Text className='text-muted'>
            Vaše telefonní číslo nebudeme s nikým sdílet.
          </Form.Text>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='sluzby'>Vyberte službu:</Form.Label>
          <Form.Control
            as='select'
            id='sluzby'
            name='service'
            onChange={handleChange}
            required
          >
            <option value='' disabled selected hidden>
              --vyberte službu--
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='date'>Vyberte termín:</Form.Label>
          <Form.Control
            type='date'
            id='date'
            name='date'
            min={today}
            max={maxDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='time'>Vyberte čas návštěvy:</Form.Label>
          <Form.Control
            as='select'
            id='time'
            name='time'
            step='1800'
            min='09:00'
            max='17:30'
            onChange={handleChange}
            required
          >
            <option value='' disabled selected hidden>
              Vyberte čas návštěvy
            </option>
            {generateHoursOptions().map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button type='submit' className='action-btn mt-3 mb-5'>
          Objednat se
        </Button>
      </Form>
    </Container>
  );
};
