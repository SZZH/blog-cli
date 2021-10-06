import { module1, module2 } from './module'
import './index.css'

const obj = {
  a: 1
}

const some = () => {
  module1(obj?.a)
}

some()
