const Subscription = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h4 className="text-primary text-xl font-bold mb-4">Subscribe</h4>
              <h1 className="text-4xl font-bold mb-6">
                Lifetime Access : Rs. 4999
              </h1>
              <p className="text-muted-foreground mb-6">
                Please send screenshot of payment and your registered email address to this WhatsApp Number <strong className="text-foreground">8279506049</strong>
              </p>
              <div className="font-bold text-lg">
                Sapana Tomar
              </div>
            </div>

            <div className="flex justify-center">
              <img src="/QR.jpeg" alt="QR Code" style={{ width: '100%', maxWidth: '500px' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscription;
