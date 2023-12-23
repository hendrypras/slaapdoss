import { render } from '@utils/testHelper';
import Footer from '@components/Footer';

let wrapper;

beforeEach(() => {
  wrapper = render(<Footer />);
});

describe('Footer', () => {
  test('Should render correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('footer')).toBeInTheDocument();
  });
  test('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
