import RadavilleNav from '../../components/RadavilleNav';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    <RadavilleNav />    
    <main className='min-h-screen pt-14'>
        {children}
    </main>
    </>
  )
}

export default Layout