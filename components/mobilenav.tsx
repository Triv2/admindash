'use client'
import {useState, useEffect} from'react'
import { Menu } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/mainnav';


const MobileNav = () => {

const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
setIsMounted(true);
}, []);

if (!isMounted) {
return null;
}
  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="flex lg:hidden">
          <Button variant="outline" size="icon">
            <Menu/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2" >
        <MainNav className="mx-6 space-x-1 flex-col items-start gap-2 lg:flex-row lg:hidden"/>
        </DropdownMenuContent>
        </DropdownMenu>
  );
}
export default MobileNav;