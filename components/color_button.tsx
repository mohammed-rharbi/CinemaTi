import React, { useState } from 'react'
import { TouchableOpacity , Text  } from 'react-native'

export default function ColorButton() {

    const [color , setColor]= useState('red')

    const changeColor = ()=>{

       setColor('#'+Math.round(Math.random() * 0xffffff).toString(16))
    }

  return (

                <TouchableOpacity  onPress={changeColor}>

                  <Text style={{color}} >change color</Text>

                </TouchableOpacity>

   
  )
}
