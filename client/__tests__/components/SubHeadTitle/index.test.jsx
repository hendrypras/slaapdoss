import { render } from '@utils/testHelper';
import SubHeadTitle from '@components/SubHeadTitle';

let wrapper;

beforeEach(() => {
  wrapper = render(<SubHeadTitle />);
});

describe('SubHeadTitle', () => {
  test('Should render correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('sub-head-title')).toBeInTheDocument();
  });
  test('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
