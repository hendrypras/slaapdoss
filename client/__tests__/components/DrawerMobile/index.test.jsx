import { render, fireEvent } from '@utils/testHelper';
import DrawerMobile from '@components/DrawerMobile';

let isOpen = true;
let wrapper;

const mockProps = {
  open: isOpen,
  height: '100vh',
  onClose: () => {
    isOpen = false;
  },
};
beforeEach(() => {
  wrapper = render(<DrawerMobile open={mockProps.open} onClose={mockProps.onClose} />);
});

describe('DrawerMobile', () => {
  test('Should render correctly', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('button-close');

    fireEvent.click(button);
    expect(isOpen).toBe(false);
    expect(getByTestId('drawer-mobile')).toBeInTheDocument();
  });
  test('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
