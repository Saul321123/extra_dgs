import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ThemedTextInputProps extends TextInputProps {
  variant?: 'default' | 'error';
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({ 
  style, 
  variant = 'default',
  ...props 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#000000',
          borderColor: variant === 'error' ? '#FF3B30' : isDark ? '#39393D' : '#E5E5EA',
        },
        style
      ]}
      placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});