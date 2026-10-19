import { fireEvent,render,screen } from '@testing-library/react';
import { useTheme } from './useTheme';
function Probe(){const {dark,toggle}=useTheme();return <button onClick={toggle}>{dark?'dark':'light'}</button>;}
describe('useTheme',()=>{
  it('persists an explicit theme preference',()=>{localStorage.clear();render(<Probe/>);fireEvent.click(screen.getByRole('button'));expect(localStorage.getItem('tmw-theme')).toBe('dark');expect(screen.getByText('dark')).toBeInTheDocument();});
});
