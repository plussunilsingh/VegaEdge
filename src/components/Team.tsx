import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Team = () => {
  const team = [
    { name: "Vinayak Koushik", role: "Senior Analyst" },
    { name: "Sanket Dikshit", role: "Trading Expert" },
    { name: "Kartik Rathod", role: "Market Strategist" },
    { name: "Kamini Bansal", role: "Risk Manager" },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h4 className="text-primary text-xl font-bold mb-4">Our Team</h4>
          <h1 className="text-4xl font-bold mb-6">Meet Our Advisers</h1>
          <p className="text-muted-foreground">
            To provide top notch stock market charting and technical analysis software that help
            businesses and individuals to manage their portfolio efficiently and generate profits
            exponentially.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={`/img/team-${index + 1}.jpg`}
                className="w-full h-64 object-cover"
                alt={member.name}
              />
              <div className="p-6 text-center">
                <h4 className="font-bold text-lg mb-1">{member.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">{member.role}</p>
                <div className="flex justify-center gap-2">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
