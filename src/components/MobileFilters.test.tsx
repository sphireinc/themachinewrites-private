import { fireEvent,render,screen } from '@testing-library/react';
import { useState } from 'react';
import { MobileFilters } from './MobileFilters';
function Probe(){const [value,setValue]=useState<'all'|'correction'>('all');return <><MobileFilters value={value} onChange={setValue}/><output>{value}</output></>;}
describe('MobileFilters',()=>{it('keeps all seven filters and selects Corrections',()=>{render(<Probe/>);const select=screen.getByLabelText('Filter');expect(select.querySelectorAll('option')).toHaveLength(7);fireEvent.change(select,{target:{value:'correction'}});expect(screen.getByText('correction')).toBeInTheDocument();});});
