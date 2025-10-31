import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = [
    {
      title: "About",
      links: ["Our Story", "Careers", "Press", "Contact Us"],
    },
    {
      title: "Terms & Conditions",
      links: ["Terms of Service", "User Agreement", "Legal Notice"],
    },
    {
      title: "Shipping & Return Policy",
      links: ["Shipping Info", "Return Policy", "Exchange Policy", "Delivery Options"],
    },
    {
      title: "Privacy Policy",
      links: ["Data Protection", "Cookie Policy", "Privacy Rights"],
    },
    {
      title: "FAQ",
      links: ["General Questions", "Order Support", "Technical Support", "Account Help"],
    },
  ];

  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">   

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kelompok 3 . All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
