import { render } from '@utils/testHelper';
import SnackBar from '@components/SnackBar';

let wrapper;
let isOpen = true;
const mockProps = {
  open: isOpen,
  message: 'message',
  onClose: () => {
    isOpen = false;
  },
};
beforeEach(() => {
  wrapper = render(<SnackBar open={mockProps.open} onClose={mockProps.onClose} message={mockProps.message} />);
});

describe('SnackBar', () => {
  test('Should render correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('snackbar')).toBeInTheDocument();
  });
  test('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
