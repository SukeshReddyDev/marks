// ============================================
// Supabase API Functions
// ============================================

// ──────────────── AUTHENTICATION ────────────────

async function loginUser(email, password, role) {
  try {
    // Hardcoded credentials for Judge and Admin
    const validCredentials = {
      judge: {
        email: 'judge@jd.com',
        password: '984869'
      },
      admin: {
        email: 'admin@ad.com',
        password: '798181'
      }
    };

    // Validate email and password for the selected role
    const roleCredentials = validCredentials[role];
    if (!roleCredentials) {
      return { success: false, message: 'Invalid role selected' };
    }

    if (email !== roleCredentials.email || password !== roleCredentials.password) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Authentication successful
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userId', `${role}-user`);

    return { success: true, user: { id: `${role}-user`, email, role } };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, message: err.message };
  }
}

// ──────────────── TEAMS ────────────────

async function getAllTeams() {
  try {
      // Try selecting including team_code; if the column doesn't exist, fall back.
      try {
        const { data: teams, error } = await supabaseClient
          .from('teams')
          .select(`
            id,
            team_code,
            name,
            college,
            project,
            team_members (name)
          `)
          .order('id');

        if (error) throw error;

        return teams.map(team => ({
          id: team.id,
          code: team.team_code || null,
          name: team.name,
          college: team.college,
          project: team.project,
          members: team.team_members.map(m => m.name) || []
        }));
      } catch (err) {
        // If team_code column is missing, retry without it
        if (err && ((err.message && err.message.toLowerCase().includes('team_code')) || (err.details && String(err.details).toLowerCase().includes('team_code')))) {
          console.warn('team_code column not found, retrying teams query without team_code');
          const { data: teams, error: e2 } = await supabaseClient
            .from('teams')
            .select(`
              id,
              name,
              college,
              project,
              team_members (name)
            `)
            .order('id');

          if (e2) throw e2;

          return teams.map(team => ({
            id: team.id,
            code: null,
            name: team.name,
            college: team.college,
            project: team.project,
            members: team.team_members.map(m => m.name) || []
          }));
        }
        throw err;
      }
  } catch (err) {
    console.error('Error fetching teams:', err);
    return [];
  }
}

async function getTeamById(teamId) {
  try {
      try {
        const { data: team, error } = await supabaseClient
          .from('teams')
          .select(`
            id,
            team_code,
            name,
            college,
            project,
            team_members (name)
          `)
          .eq('id', teamId)
          .single();

        if (error) throw error;

        return {
          id: team.id,
          code: team.team_code || null,
          name: team.name,
          college: team.college,
          project: team.project,
          members: team.team_members.map(m => m.name) || []
        };
      } catch (err) {
        if (err && ((err.message && err.message.toLowerCase().includes('team_code')) || (err.details && String(err.details).toLowerCase().includes('team_code')))) {
          console.warn('team_code column not found, retrying single team query without team_code');
          const { data: team, error: e2 } = await supabaseClient
            .from('teams')
            .select(`
              id,
              name,
              college,
              project,
              team_members (name)
            `)
            .eq('id', teamId)
            .single();

          if (e2) throw e2;

          return {
            id: team.id,
            code: null,
            name: team.name,
            college: team.college,
            project: team.project,
            members: team.team_members.map(m => m.name) || []
          };
        }
        throw err;
      }
  } catch (err) {
    console.error('Error fetching team:', err);
    return null;
  }
}

async function addTeam(name, college, project, members = [], teamCode = null) {
  try {
    const insertObj = { name, college, project };
    if (teamCode) insertObj.team_code = teamCode;
      try {
        const { data: team, error: teamError } = await supabaseClient
          .from('teams')
          .insert([insertObj])
          .select()
          .single();

        if (teamError) throw teamError;

        // Add members
        if (members.length > 0) {
          const memberData = members.map(name => ({
            team_id: team.id,
            name
          }));

          const { error: memberError } = await supabaseClient
            .from('team_members')
            .insert(memberData);

          if (memberError) throw memberError;
        }

        return { success: true, team };
      } catch (err) {
        // If insert failed due to missing team_code column, retry without it
        if (err && ((err.message && err.message.toLowerCase().includes('team_code')) || (err.details && String(err.details).toLowerCase().includes('team_code')))) {
          console.warn('team_code column not found, retrying insert without team_code');
          const { data: team, error: teamError2 } = await supabaseClient
            .from('teams')
            .insert([{ name, college, project }])
            .select()
            .single();

          if (teamError2) throw teamError2;

          if (members.length > 0) {
            const memberData = members.map(name => ({
              team_id: team.id,
              name
            }));

            const { error: memberError } = await supabaseClient
              .from('team_members')
              .insert(memberData);

            if (memberError) throw memberError;
          }

          return { success: true, team };
        }
        throw err;
      }
  } catch (err) {
    console.error('Error adding team:', err);
    return { success: false, message: err.message };
  }
}

async function updateTeam(teamId, name, college, project) {
  try {
    const { data, error } = await supabaseClient
      .from('teams')
      .update({ name, college, project })
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, team: data };
  } catch (err) {
    console.error('Error updating team:', err);
    return { success: false, message: err.message };
  }
}

async function deleteTeam(teamId) {
  try {
    console.log('🗑️ Starting cascading deletion for team ID:', teamId);
    
    // Delete team_members first
    console.log('  → Deleting team members...');
    const { error: memberError, count: memberCount } = await supabaseClient
      .from('team_members')
      .delete()
      .eq('team_id', teamId);
    
    if (memberError) {
      console.error('❌ Error deleting team members:', memberError);
      throw new Error(`Failed to delete team members: ${memberError.message}`);
    }
    console.log('✅ Team members deleted (count: ' + memberCount + ')');
    
    // Delete scores
    console.log('  → Deleting scores...');
    const { error: scoreError, count: scoreCount } = await supabaseClient
      .from('scores')
      .delete()
      .eq('team_id', teamId);
    
    if (scoreError) {
      console.error('❌ Error deleting scores:', scoreError);
      throw new Error(`Failed to delete scores: ${scoreError.message}`);
    }
    console.log('✅ Scores deleted (count: ' + scoreCount + ')');
    
    // Delete attendance records
    console.log('  → Deleting attendance records...');
    const { error: attendanceError, count: attendanceCount } = await supabaseClient
      .from('attendance')
      .delete()
      .eq('team_id', teamId);
    
    if (attendanceError) {
      console.error('❌ Error deleting attendance:', attendanceError);
      throw new Error(`Failed to delete attendance: ${attendanceError.message}`);
    }
    console.log('✅ Attendance records deleted (count: ' + attendanceCount + ')');
    
    // Delete the team itself (final step)
    console.log('  → Deleting team row from teams table...');
    const { error: teamError, count: teamDeleteCount } = await supabaseClient
      .from('teams')
      .delete()
      .eq('id', teamId);
    
    console.log('   Delete response - error:', teamError, 'count:', teamDeleteCount);
    
    if (teamError) {
      console.error('❌ Error deleting team from database:', teamError);
      console.error('   Error details:', {
        message: teamError.message,
        code: teamError.code,
        details: teamError.details,
        hint: teamError.hint,
        status: teamError.status
      });
      throw new Error(`Failed to delete team: ${teamError.message}`);
    }
    
    if (teamDeleteCount === 0) {
      console.error('❌ WARNING: Delete query returned 0 rows deleted!');
      console.error('   This usually means the delete was blocked by RLS or the team doesn\'t exist');
      throw new Error('Delete returned 0 rows - deletion may have been blocked by RLS policy');
    }
    
    console.log('✅ Team deleted from database (count: ' + teamDeleteCount + ')');
    
    console.log('🎉 Full deletion completed successfully!');
    return { success: true, message: 'Team and all related data deleted' };
  } catch (err) {
    console.error('❌ Delete team error:', err);
    console.error('   Full error object:', {
      message: err.message,
      code: err.code,
      details: err.details,
      hint: err.hint,
      status: err.status
    });
    return { success: false, message: err.message };
  }
}

// ──────────────── SCORES ────────────────

async function addScore(teamId, judgeId, judgeName, round, c1, c2, c3, c4, c5, remarks) {
  try {
    const totalScore = c1 + c2 + c3 + c4 + c5;

    const { data, error } = await supabaseClient
      .from('scores')
      .insert([{
        team_id: teamId,
        judge_id: null,
        judge_name: judgeName,
        round,
        criteria_1: c1,
        criteria_2: c2,
        criteria_3: c3,
        criteria_4: c4,
        criteria_5: c5,
        total_score: totalScore,
        remarks
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, score: data };
  } catch (err) {
    console.error('Error adding score:', err);
    return { success: false, message: err.message };
  }
}

async function getScoresByTeam(teamId) {
  try {
    const { data: scores, error } = await supabaseClient
      .from('scores')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return scores || [];
  } catch (err) {
    console.error('Error fetching team scores:', err);
    return [];
  }
}

async function getAllScores() {
  try {
    const { data: scores, error } = await supabaseClient
      .from('scores')
      .select(`
        *,
        teams (id, name, college)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return scores || [];
  } catch (err) {
    console.error('Error fetching all scores:', err);
    return [];
  }
}

// ──────────────── LEADERBOARD ────────────────

async function getLeaderboard() {
  try {
    const { data: scores, error } = await supabaseClient
      .from('scores')
      .select(`
        team_id,
        total_score,
        round,
        teams (id, name, college)
      `)
      .order('total_score', { ascending: false });

    if (error) throw error;

    // Group by team and round
    const leaderboard = {};
    scores.forEach(score => {
      const teamId = score.team_id;
      if (!leaderboard[teamId]) {
        leaderboard[teamId] = {
          id: teamId,
          team: score.teams.name,
          college: score.teams.college,
          r1: 0,
          r2: 0,
          total: 0
        };
      }

      if (score.round === 1) {
        leaderboard[teamId].r1 = score.total_score;
      } else if (score.round === 2) {
        leaderboard[teamId].r2 = score.total_score;
      }
      leaderboard[teamId].total = leaderboard[teamId].r1 + leaderboard[teamId].r2;
    });

    return Object.values(leaderboard)
      .sort((a, b) => b.total - a.total)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return [];
  }
}

// ──────────────── ATTENDANCE ────────────────

async function saveAttendanceRecords(records) {
  try {
    if (!records || records.length === 0) {
      console.log('No attendance records to save');
      return { success: true, data: [] };
    }

    console.log('📝 Attempting to save attendance records:', JSON.stringify(records, null, 2));
    console.log('Database: public, Table: attendance');
    
    const { data, error } = await supabaseClient
      .from('attendance')
      .insert(records);

    if (error) {
      console.error('❌ SUPABASE ERROR DETAILS:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        status: error.status
      });
      
      if (error.message.includes('relation') || error.message.includes('attendance')) {
        return { 
          success: false, 
          message: 'Attendance table not found in database.' 
        };
      }
      
      if (error.message.includes('permission')) {
        return { 
          success: false, 
          message: 'Permission denied. Check table permissions in Supabase.' 
        };
      }
      
      throw error;
    }
    
    console.log('✅ Attendance saved successfully! Records:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Exception while saving attendance:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    return { 
      success: false, 
      message: err.message || 'Failed to save attendance' 
    };
  }
}

async function getAttendanceByTeam(teamId) {
  try {
    const { data: attendance, error } = await supabaseClient
      .from('attendance')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return attendance || [];
  } catch (err) {
    console.error('Error fetching attendance:', err);
    return [];
  }
}

async function getAllAttendance() {
  try {
    console.log('📋 Fetching all attendance records...');
    
    // Simple query without join first
    const { data: attendance, error } = await supabaseClient
      .from('attendance')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
    
    console.log('✅ Fetched attendance records:', attendance);
    return attendance || [];
  } catch (err) {
    console.error('❌ Error fetching all attendance:', err);
    return [];
  }
}

// ──────────────── JUDGE SCORES ────────────────

async function getJudgeScores(judgeId) {
  try {
    const { data: scores, error } = await supabaseClient
      .from('scores')
      .select(`
        *,
        teams (id, name, college)
      `)
      .eq('judge_id', judgeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return scores || [];
  } catch (err) {
    console.error('Error fetching judge scores:', err);
    return [];
  }
}
