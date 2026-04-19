import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default ({ children, light = false, style, ...props }) => {
  return (
    <Text
      {...props}
      // Мы принудительно ставим черный цвет #000. 
      // Даже если система захочет сделать его белым, это свойство перекроет системное.
      style={[
        styles.defaultText, 
        style // Ваши кастомные стили (например, размер шрифта)
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    // ЖЕСТКО: Всегда черный. 
    // Если вам НУЖЕН белый текст на кнопках, замените на: 
    // color: light ? '#fff' : '#000' 
    // Но если задача "везде черный", то оставляем только #000
    color: '#000000', 
  },
});