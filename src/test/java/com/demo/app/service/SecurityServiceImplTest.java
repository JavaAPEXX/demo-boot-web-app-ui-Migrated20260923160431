package com.demo.app.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SecurityServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private SecurityServiceImpl securityServiceImpl;

    @Test
    @DisplayName("given existing username and password when autologin then returns success")
    void givenExistingUsernameAndPassword_whenAutologin_thenReturnsSuccess() {
        // Arrange
        String username = "testUser";
        String password = "testPassword";
        when(userDetailsService.loadUserByUsername(username)).thenReturn(new org.springframework.security.core.userdetails.User("testUser", "testPassword", org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(true);

        // Act
        securityServiceImpl.autologin(username, password);

        // Assert
        assertEquals(username, securityServiceImpl.findLoggedInUsername());
    }

    @Test
    @DisplayName("given non-existing username when autologin then throws exception")
    void givenNonExistingUsername_whenAutologin_thenThrowsException() {
        // Arrange
        String username = "nonExistingUser";
        when(userDetailsService.loadUserByUsername(username)).thenThrow(new UsernameNotFoundException("No User found"));

        // Act and Assert
        assertThrows(UsernameNotFoundException.class, () -> securityServiceImpl.autologin(username, "testPassword"));
    }

    @Test
    @DisplayName("given null username when autologin then throws exception")
    void givenNullUsername_whenAutologin_thenThrowsException() {
        // Arrange
        String username = null;
        when(userDetailsService.loadUserByUsername(username)).thenThrow(new NullPointerException("Username cannot be null"));

        // Act and Assert
        assertThrows(NullPointerException.class, () -> securityServiceImpl.autologin(username, "testPassword"));
    }

    @Test
    @DisplayName("given empty password when autologin then throws exception")
    void givenEmptyPassword_whenAutologin_thenThrowsException() {
        // Arrange
        String username = "testUser";
        when(userDetailsService.loadUserByUsername(username)).thenReturn(new org.springframework.security.core.userdetails.User("testUser", "", org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenThrow(new IllegalArgumentException("Password cannot be empty"));

        // Act and Assert
        assertThrows(IllegalArgumentException.class, () -> securityServiceImpl.autologin(username, ""));
    }

    @Test
    @DisplayName("given valid input when findLoggedInUsername then returns success")
    void givenValidInput_whenFindLoggedInUsername_thenReturnsSuccess() {
        // Arrange
        when(authenticationManager.getAuthentication()).thenReturn(new org.springframework.security.core.authentication.Authentication("testUser", "testPassword", org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")));

        // Act
        String result = securityServiceImpl.findLoggedInUsername();

        // Assert
        assertEquals("testUser", result);
    }

    @Test
    @DisplayName("given null when findLoggedInUsername then returns null")
    void givenNull_whenFindLoggedInUsername_thenReturnsNull() {
        // Arrange
        when(authenticationManager.getAuthentication()).thenReturn(null);

        // Act
        String result = securityServiceImpl.findLoggedInUsername();

        // Assert
        assertNull(result);
    }
}