import {AiOutlineStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJobs = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    location,
    packagePerAnnum,
    employmentType,
    description,
    rating,
  } = jobDetails

  return (
    <li className="list-item">
      <div className="profile-div">
        <img
          src={companyLogoUrl}
          className="profile-img"
          alt="similar job company logo"
        />
        <div>
          <h1>{title}</h1>
          <p>
            <AiOutlineStar />
            {rating}
          </p>
        </div>
      </div>
      <hr />
      <h1>Description</h1>
      <p>{description}</p>
      <div className="location-div">
        <div className="profile-div">
          <p className="location">
            <MdLocationOn />
            {location}
          </p>
          <p>{employmentType}</p>
        </div>
        <p>{packagePerAnnum}</p>
      </div>
    </li>
  )
}

export default SimilarJobs
