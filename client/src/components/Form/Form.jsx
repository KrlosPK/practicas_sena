import { useRef, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import { Button } from '../button/button'
import axios from 'axios'

export const Form = ({ inputs, isLoginForm }) => {
  const passwordIcons = {
    openEye: <AiOutlineEye />,
    closeEye: <AiOutlineEyeInvisible />
  }

  const passwordStatus = {
    shown: 'text',
    hidden: 'password'
  }

  const [showPassword, setShowPassword] = useState(passwordStatus.hidden)
  const formValuesRef = useRef({})

  const handlePassword = () => (showPassword === passwordStatus.shown ? setShowPassword(passwordStatus.hidden) : setShowPassword(passwordStatus.shown))

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataToSend = flattenObject(formValuesRef.current)
    sendData(dataToSend)
  }

  const flattenObject = (obj) => {
    return Object.values(obj).reduce((result, current) => {
      return { ...result, ...current }
    }, {})
  }

  const sendData = async (data) => {
    const postRoute = isLoginForm ? 'login' : 'register'
    const response = await axios.post(`http://localhost:3000/api/${postRoute}`, data)
    const { key } = isLoginForm && (await response.data)
    const token = isLoginForm && (await key.split(' ')[1])
  }

  const handleInputChange = (e, index) => {
    const { name, value } = e.target
    formValuesRef.current = {
      ...formValuesRef.current,
      [index]: {
        ...formValuesRef.current[index],
        [name]: value
      }
    }
  }

  return (
    <form action='' className='flex flex-col justify-center my-4 gap-3' onSubmit={handleSubmit}>
      {inputs.map((item, i) => {
        return (
          <div className='relative text-gray-400 mx-auto' key={i}>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>{item.icon}</span>
            {item.type === 'password' ? (
              <>
                <span onClick={handlePassword} className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-600 cursor-pointer hover:text-slate-800 transition'>
                  {showPassword === passwordStatus.shown ? passwordIcons.closeEye : passwordIcons.openEye}
                </span>
                <input type={showPassword} name={item.nameInput} className='py-1.5 text-sm text-black bg-white border-1 border-gray-400 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900 w-72' placeholder={item.placeholder} autoComplete='on' onChange={(e) => handleInputChange(e, i)} />
              </>
            ) : (
              <input type={item.type} name={item.nameInput} className='py-1.5 text-sm text-black bg-white border-1 border-gray-400 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900 w-72' placeholder={item.placeholder} autoComplete='on' onChange={(e) => handleInputChange(e, i)} />
            )}
          </div>
        )
      })}
      <hr className='w-4/5 mx-auto bg-slate-500 h-[1px] my-2' />
      <Button value={'Iniciar Sesión'} bg={'bg-primary'} />
    </form>
  )
}