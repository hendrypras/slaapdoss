import { render, fireEvent } from '@utils/testHelper';
import Button from '@components/Button';

let wrapper;
let isOpen = true;
const mockProps = {
  title: 'login',
  onClick: () => {
    isOpen = false;
  },
};

beforeEach(() => {
  wrapper = render(<Button title={mockProps.title} onClick={mockProps.onClick} />);
});

describe('Button', () => {
  test('Should render correctly', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button');

    fireEvent.click(button);
    expect(isOpen).toBe(false);
    expect(getByTestId('button')).toBeInTheDocument();
  });
  test('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
