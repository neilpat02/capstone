<script>
	import Footer from "./widget/Footer.svelte";
	import Navi from "./widget/Navi.svelte";
	import emailjs from 'emailjs-com';

	let email = "";
	let message = "";

	const handleSubmit = async () => { 
		try {
		// Use template for the text boxes
		const templateParams = {
			from_email: email,
			to_email: 'mazecomphero@gmail.com',
			message: message,
		};

		await emailjs.send('service_k9n8u89', 'template_z8jhgxg', templateParams, 'KuOnXFzA41_K7TY1A'); //send the email

		alert('Email sent successfully!'); //send successfully
		} catch (error) {
		console.error('Error sending email:', error);
		alert('Error sending email. Please try again.');
		}
	};
</script>

<section class="hero is-small has-text-centered">
    <div class="hero-body">
        <p class="title" style="color: white">
            UGA Maze Competition
        </p>
        <p class="subtitle">
            <img src="/HeRoLab.png" alt="HeRo Lab logo"/>
        </p>
    </div>
</section>
  <section class="section">
	<div class="container">
	  <h1 style="color: white" class="title">Contact Us</h1>
	  <div class="columns">
		<div class="column is-half">
		  <form on:submit|preventDefault={handleSubmit}>
			<div class="field">
			  <label style="color: white" class="label">Email</label>
			  <div class="control">
				<input
				  class="input is-danger"
				  type="email"
				  placeholder="Enter your email"
				  bind:value={email}
				/>
			  </div>
			</div>
  
			<div class="field">
			  <label style="color: white" class="label">Message</label>
			  <div class="control">
				<textarea
				  class="textarea is-danger"
				  placeholder="Type your message"
				  bind:value={message}
				></textarea>
			  </div>
			</div>
  
			<div class="field">
			  <div class="control">
				<button style="color: white; background: gray;" class="button">Submit</button>
			  </div>
			</div>
		  </form>
		</div>
	  </div>
	</div>
  </section>

  <div style="padding: 20px" class="has-text-centered">
    <p style="color: white">
      UGA Maze Competition Offical Site 
    </p>
  </div>

