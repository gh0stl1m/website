import React, { Component } from 'react'
import swal from 'sweetalert'

import Conduct from '../components/organisms/Conduct'
import Hero from '../components/organisms/Hero'
import Navbar from '../components/organisms/Navbar'
import Newsletter from '../components/organisms/Newsletter'
import Speakers from '../components/organisms/Speakers'
import Team from '../components/organisms/Team'
import What from '../components/organisms/What'
import Sponsors from '../components/organisms/Sponsors'

import fetchJson from '../utils/fetchJson'
import { logEvent } from '../utils/analytics'
import { speakers, team, sponsors } from '../utils/constants'

import { config } from '../config/client'

class Home extends Component {
  state = { name: '', email: '', loading: false }

  startLoading = () => {
    this.setState({ loading: true })
  }

  stopLoading = () => {
    this.setState({ loading: false })
  }

  resetForm = () => {
    this.setState({ name: '', email: '', loading: false })
  }

  handleSubmit = async event => {
    event && event.preventDefault()
    this.startLoading()

    try {
      const { name, email } = this.state

      await fetchJson(`${config.apiUrl}/subscribe`, {
        method: 'POST',
        body: JSON.stringify({ name, email }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      swal(
        'Great!',
        'We will send you more information to your email',
        'success'
      )

      logEvent({ category: 'signup', action: 'click', label: 'newsletter' })

      this.resetForm()
    } catch (error) {
      swal(
        'Opps!',
        'Something went wrong with your subscription, please try again',
        'error'
      )

      this.stopLoading()
      console.error('Error callilng api/subscribe', error)
    }
  }

  handleChange = name => event => {
    this.setState({ [`${name}`]: event.currentTarget.value })
  }

  render() {
    const { name, email, loading } = this.state

    return (
      <>
        <Navbar />
        <Speakers speakers={speakers} />
        <Hero />
        <What />
        <Sponsors sponsors={sponsors} />
        <Newsletter
          name={name}
          email={email}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          isLoading={loading}
        />
        <Team team={team} />
        <Conduct />
      </>
    )
  }
}

export default Home
