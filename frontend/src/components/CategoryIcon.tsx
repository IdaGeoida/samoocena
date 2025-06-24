import React from 'react'
import {
  FaLaptop,
  FaUsers,
  FaMoneyBillAlt,
  FaQuestionCircle,
  FaLightbulb,
  FaCogs,
  FaBullhorn,
  FaTruck,
  FaHeadset,
  FaBuilding,
  FaShieldAlt,
  FaHandshake,
  FaChartLine,
} from 'react-icons/fa'

interface Props {
  id: number
  className?: string
}

export default function CategoryIcon({ id, className = 'category-icon' }: Props) {
  switch (id) {
    case 1:
      return <FaLightbulb className={className} />
    case 2:
      return <FaCogs className={className} />
    case 3:
      return <FaBullhorn className={className} />
    case 5:
      return <FaTruck className={className} />
    case 6:
      return <FaHeadset className={className} />
    case 7:
      return <FaUsers className={className} />
    case 8:
      return <FaLaptop className={className} />
    case 9:
      return <FaMoneyBillAlt className={className} />
    case 10:
      return <FaBuilding className={className} />
    case 11:
      return <FaShieldAlt className={className} />
    case 12:
      return <FaHandshake className={className} />
    case 13:
      return <FaChartLine className={className} />
    default:
      return <FaQuestionCircle className={className} />
  }
}
