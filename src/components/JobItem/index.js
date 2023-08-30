import {Link} from 'react-router-dom'
import {AiOutlineStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    location,
    packagePerAnnum,
    employmentType,
    description,
    rating,
    id,
  } = jobDetails

  return (
    <Link to={`jobs/${id}`}>
      <li className="list-item">
        <div className="profile-div">
          <img
            src={companyLogoUrl}
            className="profile-img"
            alt="company logo"
          />
          <div>
            <h1>{title}</h1>
            <p>
              <AiOutlineStar />
              {rating}
            </p>
          </div>
        </div>
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
        <hr />
        <h1>Description</h1>
        <p>{description}</p>
      </li>
    </Link>
  )
}

export default JobItem
