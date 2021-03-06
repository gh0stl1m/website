import PropTypes from 'prop-types'

import Button from '../atoms/Button'
import Container from '../atoms/Container'
import Heading from '../atoms/Heading'
import Subtitle from '../atoms/Subtitle'

import { choices, decisions } from '../../utils/designTokens'

const Newsletter = ({ name, email, handleSubmit, handleChange, isLoading }) => {
  return (
    <section id="newsletter" className="newsletter">
      <Container>
        <Heading size={1} isInverted withMargin>
          Newsletter
        </Heading>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="name">
              <Subtitle size={2} isInverted>
                Fullname:
              </Subtitle>
            </label>
            <input
              name="name"
              type="name"
              placeholder="Your name"
              value={name}
              onChange={handleChange('name')}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="email">
              <Subtitle size={2} isInverted>
                Email:
              </Subtitle>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={handleChange('email')}
              required
            />
          </div>
          <Button type="submit" withMargin isDisabled={isLoading}>
            <Heading size={3} isInverted>
              Subscribe
            </Heading>
          </Button>
        </form>
        <div className="bird"></div>
      </Container>
      <style jsx>{`
        .newsletter {
          position: relative;
          background: ${choices.colors.brand.bayofmany};
          padding: 100px ${decisions.container.padding} 50px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .newsletter :global(.container) > :global(.heading) {
          position: relative;
          z-index: 1;
        }

        .form {
          position: relative;
          display: flex;
          flex-direction: column;
          max-width: ${choices.screens.xs};
          z-index: 1;
        }

        .field-group {
          margin-bottom: ${choices.spacing[5]};
        }

        label {
          display: inline-block;
          margin-bottom: ${choices.spacing[1]};
        }

        input {
          height: 40px;
          width: 100%;
          border: 1px solid transparent;
          margin-right: 20px;
          padding: 10px 20px;
          font-size: ${choices.fontSize.lg};
          color: ${choices.colors.gray[800]};
        }

        ::placeholder {
          color: ${choices.colors.gray[400]};
          font-size: ${choices.fontSize.lg};
          font-weight: 300;
        }

        .bird {
          position: absolute;
          display: inline-block;
          background-image: url('/static/images/hero-tribal-bird-vector.svg');
          background-position: center center;
          background-repeat: no-repeat;
          background-size: contain;
          top: 50%;
          left: 0;
          transform: translate(-50%, -50%);
          width: 450px;
          height: 450px;
          opacity: 0.2;
        }

        @media (${decisions.queries.screens.desktop}) {
          .newsletter {
            overflow: visible;
          }

          .bird {
            display: inline-block;
            top: -205px;
            left: -350px;
            width: 300px;
            height: 300px;
            opacity: 1;
            transform: translate(0, 0);
          }
        }
      `}</style>
    </section>
  )
}

Newsletter.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isLoading: PropTypes.bool
}

Newsletter.defaultProps = {
  handleSubmit: () => {},
  handleChange: () => {}
}

export default Newsletter
