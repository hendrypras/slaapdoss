/* eslint-disable react/prop-types */
import { render, fireEvent } from '@utils/testHelper';
import SideBar from '@components/SideBar';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));
let wrapper;
const mockProps = {
  userProfile: { image_url: 'http://asdasdas', username: 'username' },
  locale: 'id',
};
beforeEach(() => {
  wrapper = render(
    <MemoryRouter>
      <SideBar userProfile={mockProps.userProfile} locale={mockProps.locale}>
        <div>children</div>
      </SideBar>
    </MemoryRouter>
  );
});

describe('SideBar', () => {
  test('Should render correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('sidebar')).toBeInTheDocument();
  });
  test('Should call navigate when button clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('navigate-back-to-home');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(`/`);
  });
  test('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
