import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'

import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    apiJobsStatus: apiJobsStatusConstants,
    checkboxInput: [],
    radioInput: '',
    profileData: [],
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.initial,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const responseProfile = await fetch(apiUrl, options)
    if (responseProfile.ok) {
      const fetchedData = [await responseProfile.json()]
      const updatedData = fetchedData.map(profile => ({
        name: profile.profile_details.name,
        profileImageUrl: profile.profile_details.profile_image_url,
        shortBio: profile.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedData,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobsData = async () => {
    this.setState({
      apiJobsStatus: apiJobsStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInput, searchInput, radioInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInput}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        title: job.title,
        packagePerAnnum: job.package_per_annum,
        description: job.job_description,
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        rating: job.rating,
        location: job.location,
        employmentType: job.employment_type,
      }))
      this.setState({
        jobsList: updatedData,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({
        apiJobsStatus: apiJobsStatusConstants.failure,
      })
    }
  }

  renderJobSuccessView = () => {
    const {jobsList} = this.state
    const noJobs = jobsList.length === 0
    return noJobs ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className=""
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. try other filters</p>
      </div>
    ) : (
      <>
        <ul className="products-list">
          {jobsList.map(job => (
            <JobItem jobDetails={job} key={job.id} />
          ))}
        </ul>
      </>
    )
  }

  onRetryJobs = () => {
    this.getJobsData()
  }

  renderJobFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops something went wrong
      </h1>

      <button type="button" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  )

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.getJobsData)
  }

  renderRadioOptionsView = () => (
    <ul>
      {salaryRangesList.map(eachItem => (
        <li>
          <input
            type="radio"
            id={eachItem.salaryRangeId}
            onChange={this.onGetRadioOption}
          />
          <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetCheckboxOption = event => {
    const {checkboxInput} = this.state

    const inputNotInList = checkboxInput.filter(
      eachInput => eachInput === event.target.id,
    )

    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInput: [...prevState.checkboxInput, event.target.id],
        }),
        this.getJobsData,
      )
    } else {
      const filteredData = checkboxInput.filter(
        eachInput => eachInput !== event.target.id,
      )
      this.setState({checkboxInput: filteredData}, this.getJobsData)
    }
  }

  renderCheckboxView = () => (
    <ul>
      {employmentTypesList.map(eachItem => (
        <li>
          <input
            type="checkbox"
            id={eachItem.employmentTypeId}
            onChange={this.onGetCheckboxOption}
          />
          <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  getProfileView = () => {
    const {profileData, responseSuccess} = this.state

    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]

      return (
        <div>
          <img src={profileImageUrl} className="" alt="profile" />
          <h1>{name}</h1>
          <p>{shortBio}</p>
        </div>
      )
    }
    return null
  }

  retryBtn = () => {
    this.getProfileData()
  }

  getProfileFailureView = () => (
    <div>
      <button type="button" onClick={this.retryBtn}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="black" height="50" width="50" />
    </div>
  )

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitInput = () => {
    this.getJobsData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  renderProfileView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getProfileView()
      case apiStatusConstants.failure:
        return this.getProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderJobStatus = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return this.renderJobSuccessView()
      case apiJobsStatusConstants.failure:
        return this.renderJobFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div>
        <div className="profile-search-div">
          <div>
            {this.renderProfileView()}
            <hr />
            <h1>Type of Employment</h1>
            {this.renderCheckboxView()}
            <hr />
            <h1>Salary Range</h1>
            {this.renderRadioOptionsView()}
          </div>
          <div>
            <div>
              <input
                type="search"
                placeholder="Enter Search"
                value={searchInput}
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onSubmitInput}
              >
                <AiOutlineSearch />
              </button>
            </div>
            {this.renderJobStatus()}
          </div>
        </div>
      </div>
    )
  }
}

export default AllJobs
