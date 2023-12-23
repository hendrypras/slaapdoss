import { render } from '@utils/testHelper';
import ButtonLang from '@components/ButtonLang';

let wrapper;
const mockProps = {
  className: 'class',
  locale: 'id',
};

beforeEach(() => {
  wrapper = render(<ButtonLang className={mockProps.className} locale={mockProps.locale} />);
});

describe('Button', () => {
  test('Should render correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('button-lang')).toBeInTheDocument();
  });
  test('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
