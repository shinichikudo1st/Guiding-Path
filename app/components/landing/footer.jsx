import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import ctuLogo from "@/public/ctuLogo.png";

//Change appropriate footer for CCMSC
const Footer = () => {
  return (
    <footer className="bg-[#062341] text-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={ctuLogo}
                alt="CTU Logo"
                width={48}
                height={48}
                className="rounded-full relative"
              />
              <span className="text-xl font-bold">Guiding Path</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering students through guidance and support for academic
              excellence.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<FaFacebook />} />
              <SocialLink href="#" icon={<FaTwitter />} />
              <SocialLink href="#" icon={<FaInstagram />} />
              <SocialLink href="#" icon={<FaLinkedin />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="#" text="About Us" />
              <FooterLink href="#" text="Services" />
              <FooterLink href="#" text="Contact" />
              <FooterLink href="#" text="FAQ" />
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink href="#" text="Student Guide" />
              <FooterLink href="#" text="Academic Calendar" />
              <FooterLink href="#" text="Counseling Services" />
              <FooterLink href="#" text="Support" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Cebu Technological University</li>
              <li>M.J. Cuenco Ave, Cebu City</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@ctu.edu.ph</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Guiding Path. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0B6EC9] transition-colors duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, text }) => (
  <li>
    <a
      href={href}
      className="text-gray-400 hover:text-white transition-colors duration-300"
    >
      {text}
    </a>
  </li>
);

export default Footer;
