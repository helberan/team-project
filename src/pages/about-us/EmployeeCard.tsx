import { Container, Table, Row, Col } from 'react-bootstrap';
import profile1 from '../../assets/about-us/profile1.png';
import helenka from '../../assets/about-us/helenka.jpg';
import profile2 from '../../assets/about-us/profile2.png';
import profile3 from '../../assets/about-us/profile3.png';
import profile4 from '../../assets/about-us/profile4.png';
import eliska from '../../assets/about-us/eliska.png';
import './EmployeeCard.css';

interface Employee {
  id: number;
  name: string;
  specialization: string;
  education: string;
  freeTime: string;
  others: string;
  alt: string;
}

export const EmployeeCard = ({ employee }: { employee: Employee }) => {
  const profilePics = [profile1, helenka, eliska, profile4, profile2];

  return (
    <Container>
      <h4 className='employee-name'>{employee.name}</h4>{' '}
      <Row>
        <Col md={3} xs={12}>
          <img
            src={profilePics[employee.id]}
            alt={employee.alt}
            className=' employee-pic d-block mx-auto'
          ></img>
        </Col>
        <Col>
          <Table className='employee-table'>
            <tbody>
              <tr>
                <td>
                  <strong>Specializace</strong>
                </td>{' '}
                <td>{employee.specialization}</td>
              </tr>
              <tr>
                <td>
                  <strong>Vzdělání</strong>
                </td>{' '}
                <td>{employee.education}</td>
              </tr>
              <tr>
                <td>
                  <strong>Volný čas</strong>
                </td>{' '}
                <td>{employee.freeTime}</td>
              </tr>
              <tr>
                <td colSpan={2}>{employee.others}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
