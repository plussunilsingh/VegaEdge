"reference code we need to convert below code as per this project in reactJS+vite in tsx formate, refcatore code and keep a single table which contains all the strategies details and based on selected strategy it should show data, refere subscription pricing plan model ::PricingDetails.tsx"

1. below code is in php _> convert into reactJS
no dulpilcate code
use GOF + SOLID principle
use same pattern there in app for top, nav,footer all remain same

we need to open this page when user slect
from select option from /my-account page or from /chart page



1. even-driven

'<>


<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="utf-8">
        <title>Alpha Edge</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta content="" name="keywords">
        <meta content="" name="description">

        <!-- Google Web Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">

        <!-- Icon Font Stylesheet -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

        <!-- Libraries Stylesheet -->
        <link rel="stylesheet" href="lib/animate/animate.min.css"/>
        <link href="lib/lightbox/css/lightbox.min.css" rel="stylesheet">
        <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">


        <!-- Customized Bootstrap Stylesheet -->
        <link href="css/bootstrap.min.css" rel="stylesheet">

        <!-- Template Stylesheet -->
        <link href="css/style.css" rel="stylesheet">

		<style>

		.navbar-light {background-color: #000;}

		.list-style1 {
          color: #ffffff;
          font-size: 12px;
          background: #000;
          border-radius: 30px;
          padding: 7px;
          line-height: 13px;
}

.txt-style{
	text-align: left;
    line-height: 39px;
	    font-size: 20px;
}



		</style>


    </head>

    <body>

        <!-- Spinner Start -->
        <div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <!-- Spinner End -->

        <!-- Topbar Start -->
        <div class="container-fluid topbar bg-light px-5 d-none d-lg-block">
            <div class="row gx-0 align-items-center">
                <div class="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                    <div class="d-flex flex-wrap">

                        <a href="tel:+08279506049" class="text-muted small me-4"><i class="fas fa-phone-alt text-primary me-2"></i>8279506049</a>
                        <a href="mailto:contact@alphaedge.team" class="text-muted small me-0"><i class="fas fa-envelope text-primary me-2"></i>contact@alphaedge.team</a>
                    </div>
                </div>
                <div class="col-lg-4 text-center text-lg-end">
                    <div class="d-inline-flex align-items-center" style="height: 45px;">

                        <div class="dropdown"  style="display:none;" >
                            <a href="#" class="dropdown-toggle text-dark" data-bs-toggle="dropdown"><small><i class="fa fa-home text-primary me-2"></i> My Dashboard</small></a>
                            <div class="dropdown-menu rounded">
                                <a href="#" class="dropdown-item"><i class="fas fa-user-alt me-2"></i> My Profile</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-comment-alt me-2"></i> Inbox</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-bell me-2"></i> Notifications</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-cog me-2"></i> Account Settings</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-power-off me-2"></i> Log Out</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Topbar End -->

        <!-- Navbar & Hero Start -->
        <div class="container-fluid position-relative p-0">
            <nav class="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
                <a href="index.php" class="navbar-brand p-0">
                    <h1 class="text-primary"><img src="img/logo.png" style="width:27%;"> Alpha Edge </h1>
                    <!-- <img src="img/logo.png" alt="Logo"> -->
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span class="fa fa-bars"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <div class="navbar-nav ms-auto py-0">

                        <a href="about.php" style="display:none;"  class="nav-item nav-link  ">About</a>
                        <a href="service.php" style="display:none;"  style="display:none;"  class="nav-item nav-link">Services</a>
                        <a href="blog.php" style="display:none;"  class="nav-item nav-link">Blogs</a>
                        <div class="nav-item dropdown" style="display:none;" >
                            <a href="#" class="nav-link" data-bs-toggle="dropdown">
                                <span class="dropdown-toggle">Pages</span>
                            </a>
                            <div class="dropdown-menu m-0">
                                <a href="feature.php" class="dropdown-item">Our Features</a>
                                <a href="team.php" class="dropdown-item">Our team</a>
                                <a href="testimonial.php" class="dropdown-item">Testimonial</a>
                                <a href="offer.php" class="dropdown-item">Our offer</a>
                                <a href="FAQ.php" class="dropdown-item">FAQs</a>
                                <a href="404.php" class="dropdown-item">404 Page</a>
                            </div>
                        </div>


						<a href="chart.php" class="nav-item nav-link ">Chart</a>
						<a href="myaccount.php" class="nav-item nav-link ">My Account</a>
						<a href="logout.php" class="nav-item nav-link">Logout</a>


                        <a href="contact.php" class="nav-item nav-link ">Contact Us</a>

                    </div>
                    <a href="#" class="btn btn-primary rounded-pill py-2 px-4 my-3 my-lg-0 flex-shrink-0" style="display:none;" >Get Started</a>
                </div>
            </nav>

        </div>
        <!-- Navbar & Hero End -->


        <!-- Team Start -->
        <div class="container-fluid team py-5">
            <div class="container py-5">
                 <div class="container py-5">
                 <div class="d-flex justify-content-around" style="margin-top : 10px;">
     <a href="event_driven_table.php" class="btn btn-primary">Event-Driven Strategies</a>
    <a href="neutral_table.php" class="btn btn-secondary">Neutral Market Strategies</a>
    <a href="Bearish_table.php" class="btn btn-success">Bearish Market Strategies</a>
    <a href="Bullish_table.php" class="btn btn-danger">Bullish Market Strategies</a>
  </div>


                </div>
                <div class="row g-4">

                <h2>Event-Driven Strategies</h2>

                <table class="table">
    <thead>
      <tr style="background-color:black; color:white;">
        <th>Strategy</th>
        <th>Action</th>
        <th>Legs</th>
		<th>Risk Profiles</th>
        <th>Best When</th>
      </tr>
    </thead>
    <tbody>
      <tr>
	   <td>Long Stradle</td>
        <td>Buy ATM Call + Buy ATM Put</td>
         <td>2</td>
        <td>Limited</td>
		  <td>Big Move Expected</td>
      </tr>
     <tr>
	   <td>Long Strangle</td>
        <td>Buy OTM Call + Buy OTM Put</td>
         <td>2</td>
        <td>Limited</td>
		  <td>Volatile events</td>
      </tr>
      <tr>
	   <td>Reverse Iron Butterfly</td>
        <td>Buy ATM Call +  Put Sell OTM Call + put</td>
         <td>4</td>
        <td>Limited</td>
		  <td>Earnings Reports</td>
      </tr>
	    <tr>
	   <td>Reverse Iron condor</td>
        <td>Buy ATM Call +  Put Sell OTM Call + put</td>
         <td>4</td>
        <td>Limited</td>
		  <td>FOMS Meetings </td>
      </tr>
    </tbody>
  </table>



























                </div>
            </div>
        </div>
        <!-- Team End -->



        <!-- Footer Start -->
               <div class="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
            <div class="container py-5 border-start-0 border-end-0" style="border: 1px solid; border-color: rgb(255, 255, 255, 0.08);">
                <div class="row g-5">
                    <div class="col-md-6 col-lg-6 col-xl-4">
                        <div class="footer-item">
                            <a href="index.php" class="p-0">
                                <h1 class="text-white"><img src="img/wlogo.png" style="width:20%;"></i>Alpha Edge</h1>
                                <!-- <img src="img/logo.png" alt="Logo"> -->
                            </a>
                            <p class="mb-4">Tickertape provides data, information & content for Indian stocks, mutual funds, ETFs & indices.</p>
                            <div class="d-flex">
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-facebook-f text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-twitter text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-instagram text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-0" href="#"><i class="fab fa-linkedin-in text-white"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-6 col-xl-2">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Overview</h4>
                            <a href="disclaimer.php"><i class="fas fa-angle-right me-2"></i> Disclaimer</a>
                            <a href="privacy.php"><i class="fas fa-angle-right me-2"></i> Privacy Poicy</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Markets</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Customers</a>

                        </div>
                    </div>
                    <div class="col-md-4 col-lg-4 col-xl-2">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Company</h4>
                            <a href="about.php"><i class="fas fa-angle-right me-2"></i> About</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Blog</a>
                            <a href="index.php#faq"><i class="fas fa-angle-right me-2"></i> FAQ</a>
							<a href="contact.php"><i class="fas fa-angle-right me-2"></i> Contact</a>

                        </div>
                    </div>
                    <div class="col-md-8 col-lg-8 col-xl-4">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Contact Info</h4>

                            <div class="d-flex align-items-center">
                                <i class="fas fa-envelope text-primary me-3"></i>
                                <p class="text-white mb-0">contact@alphaedge.team</p>
                            </div>
                            <div class="d-flex align-items-center">
                                <i class="fa fa-phone-alt text-primary me-3"></i>
                                <p class="text-white mb-0">8279506049</p>
                            </div>
                            <div class="d-flex align-items-center mb-4">
                                <i class="fab fa-firefox-browser text-primary me-3"></i>
                                <p class="text-white mb-0">www.alphaedge.team</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer End -->

        <!-- Copyright Start -->
        <div class="container-fluid copyright py-4">
            <div class="container">
                <div class="row g-4 align-items-center">
                    <div class="col-md-6 text-center text-md-start mb-md-0">
                        <span class="text-body"><a href="#" class="border-bottom text-white"><i class="fas fa-copyright text-light me-2"></i>Alpha Edge</a>, All right reserved.</span>
                    </div>

                </div>
            </div>
        </div>
        <!-- Copyright End -->


        <!-- Back to Top -->
        <a href="#" class="btn btn-primary btn-lg-square rounded-circle back-to-top"><i class="fa fa-arrow-up"></i></a>


        <!-- JavaScript Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="lib/wow/wow.min.js"></script>
        <script src="lib/easing/easing.min.js"></script>
        <script src="lib/waypoints/waypoints.min.js"></script>
        <script src="lib/counterup/counterup.min.js"></script>
        <script src="lib/lightbox/js/lightbox.min.js"></script>
        <script src="lib/owlcarousel/owl.carousel.min.js"></script>


        <!-- Template Javascript -->
        <script src="js/main.js"></script>
    </body>

</html>

 <>'


2. neutral_table

 '<>

<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="utf-8">
        <title>Alpha Edge</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta content="" name="keywords">
        <meta content="" name="description">

        <!-- Google Web Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">

        <!-- Icon Font Stylesheet -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

        <!-- Libraries Stylesheet -->
        <link rel="stylesheet" href="lib/animate/animate.min.css"/>
        <link href="lib/lightbox/css/lightbox.min.css" rel="stylesheet">
        <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">


        <!-- Customized Bootstrap Stylesheet -->
        <link href="css/bootstrap.min.css" rel="stylesheet">

        <!-- Template Stylesheet -->
        <link href="css/style.css" rel="stylesheet">

		<style>

		.navbar-light {background-color: #000;}

		.list-style1 {
          color: #ffffff;
          font-size: 12px;
          background: #000;
          border-radius: 30px;
          padding: 7px;
          line-height: 13px;
}

.txt-style{
	text-align: left;
    line-height: 39px;
	    font-size: 20px;
}



		</style>


    </head>

    <body>

        <!-- Spinner Start -->
        <div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <!-- Spinner End -->

        <!-- Topbar Start -->
        <div class="container-fluid topbar bg-light px-5 d-none d-lg-block">
            <div class="row gx-0 align-items-center">
                <div class="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                    <div class="d-flex flex-wrap">

                        <a href="tel:+08279506049" class="text-muted small me-4"><i class="fas fa-phone-alt text-primary me-2"></i>8279506049</a>
                        <a href="mailto:contact@alphaedge.team" class="text-muted small me-0"><i class="fas fa-envelope text-primary me-2"></i>contact@alphaedge.team</a>
                    </div>
                </div>
                <div class="col-lg-4 text-center text-lg-end">
                    <div class="d-inline-flex align-items-center" style="height: 45px;">

                        <div class="dropdown"  style="display:none;" >
                            <a href="#" class="dropdown-toggle text-dark" data-bs-toggle="dropdown"><small><i class="fa fa-home text-primary me-2"></i> My Dashboard</small></a>
                            <div class="dropdown-menu rounded">
                                <a href="#" class="dropdown-item"><i class="fas fa-user-alt me-2"></i> My Profile</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-comment-alt me-2"></i> Inbox</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-bell me-2"></i> Notifications</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-cog me-2"></i> Account Settings</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-power-off me-2"></i> Log Out</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Topbar End -->

        <!-- Navbar & Hero Start -->
        <div class="container-fluid position-relative p-0">
            <nav class="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
                <a href="index.php" class="navbar-brand p-0">
                    <h1 class="text-primary"><img src="img/logo.png" style="width:27%;"> Alpha Edge </h1>
                    <!-- <img src="img/logo.png" alt="Logo"> -->
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span class="fa fa-bars"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <div class="navbar-nav ms-auto py-0">

                        <a href="about.php" style="display:none;"  class="nav-item nav-link  ">About</a>
                        <a href="service.php" style="display:none;"  style="display:none;"  class="nav-item nav-link">Services</a>
                        <a href="blog.php" style="display:none;"  class="nav-item nav-link">Blogs</a>
                        <div class="nav-item dropdown" style="display:none;" >
                            <a href="#" class="nav-link" data-bs-toggle="dropdown">
                                <span class="dropdown-toggle">Pages</span>
                            </a>
                            <div class="dropdown-menu m-0">
                                <a href="feature.php" class="dropdown-item">Our Features</a>
                                <a href="team.php" class="dropdown-item">Our team</a>
                                <a href="testimonial.php" class="dropdown-item">Testimonial</a>
                                <a href="offer.php" class="dropdown-item">Our offer</a>
                                <a href="FAQ.php" class="dropdown-item">FAQs</a>
                                <a href="404.php" class="dropdown-item">404 Page</a>
                            </div>
                        </div>


						<a href="chart.php" class="nav-item nav-link ">Chart</a>
						<a href="myaccount.php" class="nav-item nav-link ">My Account</a>
						<a href="logout.php" class="nav-item nav-link">Logout</a>


                        <a href="contact.php" class="nav-item nav-link ">Contact Us</a>

                    </div>
                    <a href="#" class="btn btn-primary rounded-pill py-2 px-4 my-3 my-lg-0 flex-shrink-0" style="display:none;" >Get Started</a>
                </div>
            </nav>

        </div>
        <!-- Navbar & Hero End -->


        <!-- Team Start -->
         <!-- Team Start -->
        <div class="container-fluid team py-5">
            <div class="container py-5">
                 <div class="container py-5">
                 <div class="d-flex justify-content-around" style="margin-top : 10px;">
     <a href="event_driven_table.php" class="btn btn-primary">Event-Driven Strategies</a>
    <a href="neutral_table.php" class="btn btn-secondary">Neutral Market Strategies</a>
    <a href="Bearish_table.php" class="btn btn-success">Bearish Market Strategies</a>
    <a href="Bullish_table.php" class="btn btn-danger">Bullish Market Strategies</a>
  </div>


                </div>
                <div class="row g-4">

                <<h2>Neutral Market Strategies</h2>

  <table class="table">
    <thead>
      <tr style="background-color:black; color:white;">
        <th>Strategy</th>
        <th>Action</th>
        <th>Legs</th>
		<th>Risk Profiles</th>
        <th>Best When</th>
      </tr>
    </thead>
    <tbody>
      <tr>
	   <td>Short Stradle</td>
        <td>Sell ATM Call + Sell ATM Put</td>
         <td>2</td>
        <td>Unlimited</td>
		  <td>Low volatiity</td>
      </tr>
     <tr>
	   <td>Short Strangle</td>
        <td>sell OTM Call + sell OTM Put</td>
         <td>2</td>
        <td>Unlimited</td>
		  <td>Range Bounds </td>
      </tr>
      <tr>
	   <td> Iron Butterfly</td>
        <td>Sell ATM Call +  Put buy OTM Call + put</td>
         <td>4</td>
        <td>Limited</td>
		  <td>Earnings Reports</td>
      </tr>
	    <tr>
	   <td>Reverse Iron condor</td>
        <td>Sell OTM Call +  Put Buy Further OTM Call + put</td>
         <td>4</td>
        <td>Limited</td>
		  <td>Wider Range  </td>
      </tr>
    </tbody>
  </table>

























                </div>
            </div>
        </div>
        <!-- Team End -->



        <!-- Footer Start -->
               <div class="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
            <div class="container py-5 border-start-0 border-end-0" style="border: 1px solid; border-color: rgb(255, 255, 255, 0.08);">
                <div class="row g-5">
                    <div class="col-md-6 col-lg-6 col-xl-4">
                        <div class="footer-item">
                            <a href="index.php" class="p-0">
                                <h1 class="text-white"><img src="img/wlogo.png" style="width:20%;"></i>Alpha Edge</h1>
                                <!-- <img src="img/logo.png" alt="Logo"> -->
                            </a>
                            <p class="mb-4">Tickertape provides data, information & content for Indian stocks, mutual funds, ETFs & indices.</p>
                            <div class="d-flex">
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-facebook-f text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-twitter text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-instagram text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-0" href="#"><i class="fab fa-linkedin-in text-white"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-6 col-xl-2">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Overview</h4>
                            <a href="disclaimer.php"><i class="fas fa-angle-right me-2"></i> Disclaimer</a>
                            <a href="privacy.php"><i class="fas fa-angle-right me-2"></i> Privacy Poicy</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Markets</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Customers</a>

                        </div>
                    </div>
                    <div class="col-md-4 col-lg-4 col-xl-2">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Company</h4>
                            <a href="about.php"><i class="fas fa-angle-right me-2"></i> About</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Blog</a>
                            <a href="index.php#faq"><i class="fas fa-angle-right me-2"></i> FAQ</a>
							<a href="contact.php"><i class="fas fa-angle-right me-2"></i> Contact</a>

                        </div>
                    </div>
                    <div class="col-md-8 col-lg-8 col-xl-4">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Contact Info</h4>

                            <div class="d-flex align-items-center">
                                <i class="fas fa-envelope text-primary me-3"></i>
                                <p class="text-white mb-0">contact@alphaedge.team</p>
                            </div>
                            <div class="d-flex align-items-center">
                                <i class="fa fa-phone-alt text-primary me-3"></i>
                                <p class="text-white mb-0">8279506049</p>
                            </div>
                            <div class="d-flex align-items-center mb-4">
                                <i class="fab fa-firefox-browser text-primary me-3"></i>
                                <p class="text-white mb-0">www.alphaedge.team</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer End -->

        <!-- Copyright Start -->
        <div class="container-fluid copyright py-4">
            <div class="container">
                <div class="row g-4 align-items-center">
                    <div class="col-md-6 text-center text-md-start mb-md-0">
                        <span class="text-body"><a href="#" class="border-bottom text-white"><i class="fas fa-copyright text-light me-2"></i>Alpha Edge</a>, All right reserved.</span>
                    </div>

                </div>
            </div>
        </div>
        <!-- Copyright End -->


        <!-- Back to Top -->
        <a href="#" class="btn btn-primary btn-lg-square rounded-circle back-to-top"><i class="fa fa-arrow-up"></i></a>


        <!-- JavaScript Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="lib/wow/wow.min.js"></script>
        <script src="lib/easing/easing.min.js"></script>
        <script src="lib/waypoints/waypoints.min.js"></script>
        <script src="lib/counterup/counterup.min.js"></script>
        <script src="lib/lightbox/js/lightbox.min.js"></script>
        <script src="lib/owlcarousel/owl.carousel.min.js"></script>


        <!-- Template Javascript -->
        <script src="js/main.js"></script>
    </body>

</html>

  <>'

3. Bearish_table

'<>


<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="utf-8">
        <title>Alpha Edge</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta content="" name="keywords">
        <meta content="" name="description">

        <!-- Google Web Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">

        <!-- Icon Font Stylesheet -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

        <!-- Libraries Stylesheet -->
        <link rel="stylesheet" href="lib/animate/animate.min.css"/>
        <link href="lib/lightbox/css/lightbox.min.css" rel="stylesheet">
        <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">


        <!-- Customized Bootstrap Stylesheet -->
        <link href="css/bootstrap.min.css" rel="stylesheet">

        <!-- Template Stylesheet -->
        <link href="css/style.css" rel="stylesheet">

		<style>

		.navbar-light {background-color: #000;}

		.list-style1 {
          color: #ffffff;
          font-size: 12px;
          background: #000;
          border-radius: 30px;
          padding: 7px;
          line-height: 13px;
}

.txt-style{
	text-align: left;
    line-height: 39px;
	    font-size: 20px;
}



		</style>


    </head>

    <body>

        <!-- Spinner Start -->
        <div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <!-- Spinner End -->

        <!-- Topbar Start -->
        <div class="container-fluid topbar bg-light px-5 d-none d-lg-block">
            <div class="row gx-0 align-items-center">
                <div class="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                    <div class="d-flex flex-wrap">

                        <a href="tel:+08279506049" class="text-muted small me-4"><i class="fas fa-phone-alt text-primary me-2"></i>8279506049</a>
                        <a href="mailto:contact@alphaedge.team" class="text-muted small me-0"><i class="fas fa-envelope text-primary me-2"></i>contact@alphaedge.team</a>
                    </div>
                </div>
                <div class="col-lg-4 text-center text-lg-end">
                    <div class="d-inline-flex align-items-center" style="height: 45px;">

                        <div class="dropdown"  style="display:none;" >
                            <a href="#" class="dropdown-toggle text-dark" data-bs-toggle="dropdown"><small><i class="fa fa-home text-primary me-2"></i> My Dashboard</small></a>
                            <div class="dropdown-menu rounded">
                                <a href="#" class="dropdown-item"><i class="fas fa-user-alt me-2"></i> My Profile</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-comment-alt me-2"></i> Inbox</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-bell me-2"></i> Notifications</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-cog me-2"></i> Account Settings</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-power-off me-2"></i> Log Out</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Topbar End -->

        <!-- Navbar & Hero Start -->
        <div class="container-fluid position-relative p-0">
            <nav class="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
                <a href="index.php" class="navbar-brand p-0">
                    <h1 class="text-primary"><img src="img/logo.png" style="width:27%;"> Alpha Edge </h1>
                    <!-- <img src="img/logo.png" alt="Logo"> -->
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span class="fa fa-bars"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <div class="navbar-nav ms-auto py-0">

                        <a href="about.php" style="display:none;"  class="nav-item nav-link  ">About</a>
                        <a href="service.php" style="display:none;"  style="display:none;"  class="nav-item nav-link">Services</a>
                        <a href="blog.php" style="display:none;"  class="nav-item nav-link">Blogs</a>
                        <div class="nav-item dropdown" style="display:none;" >
                            <a href="#" class="nav-link" data-bs-toggle="dropdown">
                                <span class="dropdown-toggle">Pages</span>
                            </a>
                            <div class="dropdown-menu m-0">
                                <a href="feature.php" class="dropdown-item">Our Features</a>
                                <a href="team.php" class="dropdown-item">Our team</a>
                                <a href="testimonial.php" class="dropdown-item">Testimonial</a>
                                <a href="offer.php" class="dropdown-item">Our offer</a>
                                <a href="FAQ.php" class="dropdown-item">FAQs</a>
                                <a href="404.php" class="dropdown-item">404 Page</a>
                            </div>
                        </div>


						<a href="chart.php" class="nav-item nav-link ">Chart</a>
						<a href="myaccount.php" class="nav-item nav-link ">My Account</a>
						<a href="logout.php" class="nav-item nav-link">Logout</a>


                        <a href="contact.php" class="nav-item nav-link ">Contact Us</a>

                    </div>
                    <a href="#" class="btn btn-primary rounded-pill py-2 px-4 my-3 my-lg-0 flex-shrink-0" style="display:none;" >Get Started</a>
                </div>
            </nav>

        </div>
        <!-- Navbar & Hero End -->


        <!-- Team Start -->
        <!-- Team Start -->
        <div class="container-fluid team py-5">
            <div class="container py-5">
                 <div class="container py-5">
                 <div class="d-flex justify-content-around" style="margin-top : 10px;">
     <a href="event_driven_table.php" class="btn btn-primary">Event-Driven Strategies</a>
    <a href="neutral_table.php" class="btn btn-secondary">Neutral Market Strategies</a>
    <a href="Bearish_table.php" class="btn btn-success">Bearish Market Strategies</a>
    <a href="Bullish_table.php" class="btn btn-danger">Bullish Market Strategies</a>
  </div>


                </div>
                <div class="row g-4">
               <h2>Bearish Market Strategies</h2>

  <table class="table">
    <thead>
     <tr style="background-color:black; color:white;">
        <th>Strategy</th>
        <th>Action</th>
        <th>Legs</th>
		<th>Risk Profiles</th>
        <th>Best When</th>
      </tr>
    </thead>
    <tbody>
      <tr>
	   <td>Naked Put </td>
        <td>But 1 ATM Put</td>
         <td>1</td>
        <td>Limited</td>
		  <td>Strong Conviction </td>
      </tr>
     <tr>
	   <td>Bear Putt Spread</td>
        <td>Buy ATM put + sell OTM Put</td>
         <td>2</td>
        <td>Limited</td>
		  <td>Moderate downside  </td>
      </tr>
      <tr>
	   <td> Bearish Ratio spread</td>
        <td>buy 2 ATM puts +  sell 1  OTM  put</td>
         <td>3</td>
        <td>Unlimited</td>
		  <td>Volatile markets</td>
      </tr>
	    <tr>
	   <td>Bear call spread  </td>
        <td>Sell ATM Call +   Buy  OTM Call  </td>
         <td>2</td>
        <td>Limited</td>
		  <td>midly bearish  </td>
      </tr>
	   <tr>
	   <td>Bear call ladder  </td>
        <td>Sell ATM Call +   Buy  OTM Call + buy deep OTM call  </td>
         <td>3</td>
        <td>Unlimited</td>
		  <td>high volability  </td>
      </tr>
    </tbody>
  </table>

























                </div>
            </div>
        </div>
        <!-- Team End -->



        <!-- Footer Start -->
               <div class="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
            <div class="container py-5 border-start-0 border-end-0" style="border: 1px solid; border-color: rgb(255, 255, 255, 0.08);">
                <div class="row g-5">
                    <div class="col-md-6 col-lg-6 col-xl-4">
                        <div class="footer-item">
                            <a href="index.php" class="p-0">
                                <h1 class="text-white"><img src="img/wlogo.png" style="width:20%;"></i>Alpha Edge</h1>
                                <!-- <img src="img/logo.png" alt="Logo"> -->
                            </a>
                            <p class="mb-4">Tickertape provides data, information & content for Indian stocks, mutual funds, ETFs & indices.</p>
                            <div class="d-flex">
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-facebook-f text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-twitter text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-instagram text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-0" href="#"><i class="fab fa-linkedin-in text-white"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-6 col-xl-2">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Overview</h4>
                            <a href="disclaimer.php"><i class="fas fa-angle-right me-2"></i> Disclaimer</a>
                            <a href="privacy.php"><i class="fas fa-angle-right me-2"></i> Privacy Poicy</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Markets</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Customers</a>

                        </div>
                    </div>
                    <div class="col-md-4 col-lg-4 col-xl-2">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Company</h4>
                            <a href="about.php"><i class="fas fa-angle-right me-2"></i> About</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Blog</a>
                            <a href="index.php#faq"><i class="fas fa-angle-right me-2"></i> FAQ</a>
							<a href="contact.php"><i class="fas fa-angle-right me-2"></i> Contact</a>

                        </div>
                    </div>
                    <div class="col-md-8 col-lg-8 col-xl-4">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Contact Info</h4>

                            <div class="d-flex align-items-center">
                                <i class="fas fa-envelope text-primary me-3"></i>
                                <p class="text-white mb-0">contact@alphaedge.team</p>
                            </div>
                            <div class="d-flex align-items-center">
                                <i class="fa fa-phone-alt text-primary me-3"></i>
                                <p class="text-white mb-0">8279506049</p>
                            </div>
                            <div class="d-flex align-items-center mb-4">
                                <i class="fab fa-firefox-browser text-primary me-3"></i>
                                <p class="text-white mb-0">www.alphaedge.team</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer End -->

        <!-- Copyright Start -->
        <div class="container-fluid copyright py-4">
            <div class="container">
                <div class="row g-4 align-items-center">
                    <div class="col-md-6 text-center text-md-start mb-md-0">
                        <span class="text-body"><a href="#" class="border-bottom text-white"><i class="fas fa-copyright text-light me-2"></i>Alpha Edge</a>, All right reserved.</span>
                    </div>

                </div>
            </div>
        </div>
        <!-- Copyright End -->


        <!-- Back to Top -->
        <a href="#" class="btn btn-primary btn-lg-square rounded-circle back-to-top"><i class="fa fa-arrow-up"></i></a>


        <!-- JavaScript Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="lib/wow/wow.min.js"></script>
        <script src="lib/easing/easing.min.js"></script>
        <script src="lib/waypoints/waypoints.min.js"></script>
        <script src="lib/counterup/counterup.min.js"></script>
        <script src="lib/lightbox/js/lightbox.min.js"></script>
        <script src="lib/owlcarousel/owl.carousel.min.js"></script>


        <!-- Template Javascript -->
        <script src="js/main.js"></script>
    </body>

</html>

<>'



4. Bullish_table

'<>


<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="utf-8">
        <title>Alpha Edge</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta content="" name="keywords">
        <meta content="" name="description">

        <!-- Google Web Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">

        <!-- Icon Font Stylesheet -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

        <!-- Libraries Stylesheet -->
        <link rel="stylesheet" href="lib/animate/animate.min.css"/>
        <link href="lib/lightbox/css/lightbox.min.css" rel="stylesheet">
        <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">


        <!-- Customized Bootstrap Stylesheet -->
        <link href="css/bootstrap.min.css" rel="stylesheet">

        <!-- Template Stylesheet -->
        <link href="css/style.css" rel="stylesheet">

		<style>

		.navbar-light {background-color: #000;}

		.list-style1 {
          color: #ffffff;
          font-size: 12px;
          background: #000;
          border-radius: 30px;
          padding: 7px;
          line-height: 13px;
}

.txt-style{
	text-align: left;
    line-height: 39px;
	    font-size: 20px;
}



		</style>


    </head>

    <body>

        <!-- Spinner Start -->
        <div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <!-- Spinner End -->

        <!-- Topbar Start -->
        <div class="container-fluid topbar bg-light px-5 d-none d-lg-block">
            <div class="row gx-0 align-items-center">
                <div class="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                    <div class="d-flex flex-wrap">

                        <a href="tel:+08279506049" class="text-muted small me-4"><i class="fas fa-phone-alt text-primary me-2"></i>8279506049</a>
                        <a href="mailto:contact@alphaedge.team" class="text-muted small me-0"><i class="fas fa-envelope text-primary me-2"></i>contact@alphaedge.team</a>
                    </div>
                </div>
                <div class="col-lg-4 text-center text-lg-end">
                    <div class="d-inline-flex align-items-center" style="height: 45px;">

                        <div class="dropdown"  style="display:none;" >
                            <a href="#" class="dropdown-toggle text-dark" data-bs-toggle="dropdown"><small><i class="fa fa-home text-primary me-2"></i> My Dashboard</small></a>
                            <div class="dropdown-menu rounded">
                                <a href="#" class="dropdown-item"><i class="fas fa-user-alt me-2"></i> My Profile</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-comment-alt me-2"></i> Inbox</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-bell me-2"></i> Notifications</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-cog me-2"></i> Account Settings</a>
                                <a href="#" class="dropdown-item"><i class="fas fa-power-off me-2"></i> Log Out</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Topbar End -->

        <!-- Navbar & Hero Start -->
        <div class="container-fluid position-relative p-0">
            <nav class="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
                <a href="index.php" class="navbar-brand p-0">
                    <h1 class="text-primary"><img src="img/logo.png" style="width:27%;"> Alpha Edge </h1>
                    <!-- <img src="img/logo.png" alt="Logo"> -->
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span class="fa fa-bars"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <div class="navbar-nav ms-auto py-0">

                        <a href="about.php" style="display:none;"  class="nav-item nav-link  ">About</a>
                        <a href="service.php" style="display:none;"  style="display:none;"  class="nav-item nav-link">Services</a>
                        <a href="blog.php" style="display:none;"  class="nav-item nav-link">Blogs</a>
                        <div class="nav-item dropdown" style="display:none;" >
                            <a href="#" class="nav-link" data-bs-toggle="dropdown">
                                <span class="dropdown-toggle">Pages</span>
                            </a>
                            <div class="dropdown-menu m-0">
                                <a href="feature.php" class="dropdown-item">Our Features</a>
                                <a href="team.php" class="dropdown-item">Our team</a>
                                <a href="testimonial.php" class="dropdown-item">Testimonial</a>
                                <a href="offer.php" class="dropdown-item">Our offer</a>
                                <a href="FAQ.php" class="dropdown-item">FAQs</a>
                                <a href="404.php" class="dropdown-item">404 Page</a>
                            </div>
                        </div>


						<a href="chart.php" class="nav-item nav-link ">Chart</a>
						<a href="myaccount.php" class="nav-item nav-link ">My Account</a>
						<a href="logout.php" class="nav-item nav-link">Logout</a>


                        <a href="contact.php" class="nav-item nav-link ">Contact Us</a>

                    </div>
                    <a href="#" class="btn btn-primary rounded-pill py-2 px-4 my-3 my-lg-0 flex-shrink-0" style="display:none;" >Get Started</a>
                </div>
            </nav>

        </div>
        <!-- Navbar & Hero End -->


        <!-- Team Start -->
         <!-- Team Start -->
        <div class="container-fluid team py-5">
            <div class="container py-5">
                 <div class="container py-5">
                 <div class="d-flex justify-content-around" style="margin-top : 10px;">
     <a href="event_driven_table.php" class="btn btn-primary">Event-Driven Strategies</a>
    <a href="neutral_table.php" class="btn btn-secondary">Neutral Market Strategies</a>
    <a href="Bearish_table.php" class="btn btn-success">Bearish Market Strategies</a>
    <a href="Bullish_table.php" class="btn btn-danger">Bullish Market Strategies</a>
  </div>


                </div>
                <div class="row g-4">
             <h2>Bullish Market Strategies</h2>

  <table class="table">
    <thead>
      <tr style="background-color:black; color:white;">
        <th>Strategy</th>
        <th>Action</th>
        <th>Legs</th>
		<th>Risk Profiles</th>
        <th>Best When</th>
      </tr>
    </thead>
    <tbody>
      <tr>
	   <td>Naked call </td>
        <td>But 1 ATM call</td>
         <td>1</td>
        <td>Unlimited</td>
		  <td>Strong Conviction </td>
      </tr>
     <tr>
	   <td>Bull call Spread</td>
        <td>Buy ATM call + sell OTM call</td>
         <td>2</td>
        <td>Limited</td>
		  <td>Moderate upside  </td>
      </tr>
      <tr>
	   <td> Bullish Ratio spread</td>
        <td>buy 2 ATM calls +  sell 1  OTM  call</td>
         <td>3</td>
        <td>Unlimited</td>
		  <td>Volatile markets</td>
      </tr>
	    <tr>
	   <td>Bull put spread  </td>
        <td>Sell ATM put +   Buy  OTM put  </td>
         <td>2</td>
        <td>Limited</td>
		  <td>midly bullish  </td>
      </tr>
	   <tr>
	   <td>Bull put ladder  </td>
        <td>Sell ATM put +   Buy  OTM put + buy deep OTM put  </td>
         <td>3</td>
        <td>Unlimited</td>
		  <td>high volability  </td>
      </tr>
    </tbody>
  </table>























                </div>
            </div>
        </div>
        <!-- Team End -->



        <!-- Footer Start -->
               <div class="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
            <div class="container py-5 border-start-0 border-end-0" style="border: 1px solid; border-color: rgb(255, 255, 255, 0.08);">
                <div class="row g-5">
                    <div class="col-md-6 col-lg-6 col-xl-4">
                        <div class="footer-item">
                            <a href="index.php" class="p-0">
                                <h1 class="text-white"><img src="img/wlogo.png" style="width:20%;"></i>Alpha Edge</h1>
                                <!-- <img src="img/logo.png" alt="Logo"> -->
                            </a>
                            <p class="mb-4">Tickertape provides data, information & content for Indian stocks, mutual funds, ETFs & indices.</p>
                            <div class="d-flex">
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-facebook-f text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-twitter text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i class="fab fa-instagram text-white"></i></a>
                                <a class="btn btn-primary btn-sm-square rounded-circle me-0" href="#"><i class="fab fa-linkedin-in text-white"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-6 col-xl-2">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Overview</h4>
                            <a href="disclaimer.php"><i class="fas fa-angle-right me-2"></i> Disclaimer</a>
                            <a href="privacy.php"><i class="fas fa-angle-right me-2"></i> Privacy Poicy</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Markets</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Customers</a>

                        </div>
                    </div>
                    <div class="col-md-4 col-lg-4 col-xl-2">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Company</h4>
                            <a href="about.php"><i class="fas fa-angle-right me-2"></i> About</a>
                            <a href="#"><i class="fas fa-angle-right me-2"></i> Blog</a>
                            <a href="index.php#faq"><i class="fas fa-angle-right me-2"></i> FAQ</a>
							<a href="contact.php"><i class="fas fa-angle-right me-2"></i> Contact</a>

                        </div>
                    </div>
                    <div class="col-md-8 col-lg-8 col-xl-4">
                        <div class="footer-item">
                            <h4 class="text-white mb-4">Contact Info</h4>

                            <div class="d-flex align-items-center">
                                <i class="fas fa-envelope text-primary me-3"></i>
                                <p class="text-white mb-0">contact@alphaedge.team</p>
                            </div>
                            <div class="d-flex align-items-center">
                                <i class="fa fa-phone-alt text-primary me-3"></i>
                                <p class="text-white mb-0">8279506049</p>
                            </div>
                            <div class="d-flex align-items-center mb-4">
                                <i class="fab fa-firefox-browser text-primary me-3"></i>
                                <p class="text-white mb-0">www.alphaedge.team</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer End -->

        <!-- Copyright Start -->
        <div class="container-fluid copyright py-4">
            <div class="container">
                <div class="row g-4 align-items-center">
                    <div class="col-md-6 text-center text-md-start mb-md-0">
                        <span class="text-body"><a href="#" class="border-bottom text-white"><i class="fas fa-copyright text-light me-2"></i>Alpha Edge</a>, All right reserved.</span>
                    </div>

                </div>
            </div>
        </div>
        <!-- Copyright End -->


        <!-- Back to Top -->
        <a href="#" class="btn btn-primary btn-lg-square rounded-circle back-to-top"><i class="fa fa-arrow-up"></i></a>


        <!-- JavaScript Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="lib/wow/wow.min.js"></script>
        <script src="lib/easing/easing.min.js"></script>
        <script src="lib/waypoints/waypoints.min.js"></script>
        <script src="lib/counterup/counterup.min.js"></script>
        <script src="lib/lightbox/js/lightbox.min.js"></script>
        <script src="lib/owlcarousel/owl.carousel.min.js"></script>


        <!-- Template Javascript -->
        <script src="js/main.js"></script>
    </body>

</html>

<>'


- here we need to use a table function or class or a file/page which be reusable based on selection it load data.reactJS