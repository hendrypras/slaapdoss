import { render } from '@utils/testHelper';
import SearchCabin from '@components/Search/Cabin';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SearchCabin', () => {
  test('Should render correctly', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <SearchCabin searchValue={{}} cabinsLocation={[]} />
      </MemoryRouter>
    );
    expect(getByTestId('search-cabin')).toBeInTheDocument();
  });
});
