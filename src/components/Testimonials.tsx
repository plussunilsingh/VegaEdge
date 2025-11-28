import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    { name: "Apeksha Sharma", review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis blanditiis excepturi quisquam temporibus voluptatum reprehenderit culpa, quasi corrupti laborum accusamus." },
    { name: "Pranjal Koar", review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis blanditiis excepturi quisquam temporibus voluptatum reprehenderit culpa, quasi corrupti laborum accusamus." },
    { name: "Santosh Jha", review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis blanditiis excepturi quisquam temporibus voluptatum reprehenderit culpa, quasi corrupti laborum accusamus." },
    { name: "Vinay Avasthi", review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis blanditiis excepturi quisquam temporibus voluptatum reprehenderit culpa, quasi corrupti laborum accusamus." }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h4 className="text-primary text-xl font-bold mb-4">Testimonial</h4>
          <h1 className="text-4xl font-bold mb-6">Our Clients Reviews</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card rounded-2xl p-6 shadow-lg relative">
              <div className="text-6xl text-primary/20 absolute top-4 left-4">"</div>
              <div className="relative z-10">
                <img src={`/img/testimonial-${index + 1}.jpg`} className="w-16 h-16 rounded-full object-cover mx-auto mb-4 mt-8" alt={testimonial.name} />
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  {testimonial.review}
                </p>
                <div className="text-center">
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <div className="flex justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-6xl text-primary/20 absolute bottom-4 right-4 rotate-180">"</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
