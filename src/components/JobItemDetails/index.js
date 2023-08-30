// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import SimilarJobs from '../SimilarJobs'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}


class JobItemDetails extends Component {
  state = {
    jobData: [],
    similarJobData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.initial})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = [fetchedData.job_details].map(eachJob => ({
        description: eachJob.job_description,
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        companyWebsiteUrl: eachJob.company_website_url,
        employmentType: eachJob.employment_type,
        title: eachJob.title,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        location: eachJob.location,
        lifeAtCompany: {
          imageUrl: eachJob.life_at_company.imageUrl,
          description: eachJob.life_at_company.description,
        },
        skills: eachJob.skills.map(eachSkill => ({
          imageUrl: eachSkill.imageUrl,
          name: eachSkill.name,
        })),
      }))
      const updatedSimilarJobData = fetchedData.similar_jobs.map(
        eachSimilarData => ({
          title: eachSimilarData.title,
          packagePerAnnum: eachSimilarData.package_per_annum,
          description: eachSimilarData.job_description,
          id: eachSimilarData.id,
          companyLogoUrl: eachSimilarData.company_logo_url,
          rating: eachSimilarData.rating,
          location: eachSimilarData.location,
          employmentType: eachSimilarData.employment_type,
        }),
      )

      this.setState({
        jobData: updatedData,
        similarJobData: updatedSimilarJobData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  retryBtn = () => {
    this.getJobData()
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retryBtn}>Retry</button>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {jobData, similarJobData} = this.state

    if (jobData.length >= 1) {
      const {
        rating,
        location,
        description,
        packagePerAnnum,
        companyWebsiteUrl,
        title,
        companyLogoUrl,
        skills,
        lifeAtCompany,
        employmentType
      } = jobData[0]

      return (
        <div>
          <div className="main-div1">
            <img
              src={companyLogoUrl}
              className="detailed-img"
              alt="job details company logo"
            />
            <div>
              <h1>{title}</h1>
              <p>{rating}</p>
            </div>
            <div>
              <p>{location}</p>
              <p>{packagePerAnnum}</p>
              <p>{employmentType} </p>
            </div>
            <hr />
            <h1>Description</h1>
            <a href={companyWebsiteUrl}>Visit</a>
            <p>{description}</p>
          <h1>Skills</h1>
          <ul>
            {skills.map(eachSkill => (
              <li key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  className=""
                  alt={eachSkill.name}
                />
                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <div>
            <h1>Life at Company</h1>
            <p>{lifeAtCompany.description}</p>
            <div>
              <img
                src={lifeAtCompany.imageUrl}
                className=""
                alt="life at company"
              />
            </div>
          </div>
          <h1>Similar Jobs</h1>
          <ul className="ul-list">
            {similarJobData.map(eachProduct => (
              <SimilarJobs jobDetails={eachProduct} key={eachProduct.id} />
            ))}
          </ul>
        </div>
        </div>
      )
    }
    return null
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()

      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div>{this.renderProductDetails()}</div>
      </div>
    )
  }
}

export default JobItemDetails
