```java
package com.demo.app.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.demo.app.model.Role;
import com.demo.app.model.User;
import com.demo.app.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    @DisplayName("Given existing user when loadUserByUsername then return populated UserDetails")
    void givenExistingUser_whenLoadUserByUsername_thenReturnUserDetails() {
        // Arrange
        String username = "john.doe";
        String password = "securePass";
        Role roleUser = new Role();
        roleUser.setName("ROLE_USER");
        Role roleAdmin = new Role();
        roleAdmin.setName("ROLE_ADMIN");
        Set<Role> roles = new HashSet<>();
        roles.add(roleUser);
        roles.add(roleAdmin);

        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setRoles(roles);

        when(userRepository.findByUsername(username)).thenReturn(user);

        // Act
        UserDetails result = userDetailsService.loadUserByUsername(username);

        // Assert
        assertNotNull(result, "UserDetails should not be null for existing user");
        assertEquals(username, result.getUsername(), "Username should match");
        assertEquals(password, result.get