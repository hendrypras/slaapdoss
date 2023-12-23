import { render } from '@utils/testHelper';
import HeadTitle from '@components/HeadTitle';

let wrapper;

beforeEach(() => {
  wrapper = render(<HeadTitle />);
});

describe('HeadTitle', () => {
  test('Should render correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('head-title')).toBeInTheDocument();
  });
  test('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
