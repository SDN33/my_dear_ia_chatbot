

export function Footer() {
  return (
    <footer className="col-span-2 text-center text-gray-800 dark:text-gray-400 mt-8 mx-auto">
      <p className="text-xs md:text-sm">
        &copy; {new Date().getFullYear()} My Dear IA - Une création de <a href="https://stillinov.com" className='underline'>Still-inov Agency</a>. Tous droits réservés.
      </p>
      <p className="text-xs md:text-sm mt-2 space-x-2">
        <a href="/contact" className='underline'>Contactez-nous</a>
        <span>-</span>
        <a href="/legal" className='underline'>Mentions Légales</a>
        <span>-</span>
        <a href="/privacy" className='underline'>Confidentialité</a>
        <span>-</span>
        <a href="/cookies" className='underline'>Cookies</a>
      </p>
    </footer>
  );
}
