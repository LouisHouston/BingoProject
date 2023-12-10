/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */

exports.up = (pgm) => {
   
    pgm.sql(`
    CREATE TABLE IF NOT EXISTS bingo_cards (
        card_id SERIAL PRIMARY KEY,
        game_id INTEGER,
        user_id INTEGER,
        numbers INTEGER[][],
        selected BOOLEAN[][],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
     
    pgm.sql(`
    CREATE TABLE IF NOT EXISTS drawn_numbers (
        draw_id SERIAL PRIMARY KEY,
        game_id INTEGER,
        numbers INTEGER[],
        drawn_index INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );
    `);
    pgm.sql(`
    CREATE TABLE IF NOT EXISTS bingo_game (
        id SERIAL PRIMARY KEY,
        game_socket_id VARCHAR NOT NULL,
        game_id INTEGER,
        user_id INTEGER[],
        user_x_card_id INTEGER[],
        user_y_card_id INTEGER,
        drawn_numbers_id INTEGER,
        numbers INTEGER[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );
    `);
   
    pgm.sql(`
    CREATE OR REPLACE FUNCTION generate_bingo_card() RETURNS INTEGER AS $$
    DECLARE
        new_card_id INTEGER;
        bingo_numbers INTEGER[][];
        selected_numbers BOOLEAN[][];
        size INT := 5; -- Bingo card size (5x5)
        middle_index INT := (size + 1) / 2; 
        column_range INT := 15; 
        i INT;
        j INT;
        used_numbers INTEGER[] := '{}'; 
    BEGIN
       
        bingo_numbers := ARRAY(SELECT ARRAY(SELECT NULL::INTEGER FROM generate_series(1, size)) FROM generate_series(1, size));
        selected_numbers := ARRAY(SELECT ARRAY(SELECT NULL::BOOLEAN FROM generate_series(1, size)) FROM generate_series(1, size));
    
        FOR j IN 1..size LOOP
            FOR i IN 1..size LOOP
                IF i = middle_index AND j = middle_index THEN
                    bingo_numbers[i][j] := 0; 
                    selected_numbers[i][j] := TRUE; 
                ELSE
                    LOOP
                        bingo_numbers[i][j] := (j - 1) * column_range + FLOOR(RANDOM() * column_range + 1);
                        
    
                        IF bingo_numbers[i][j] = ANY(used_numbers) THEN
                            CONTINUE; 
                        END IF;
    
                        EXIT; 
                    END LOOP;
    
                    used_numbers := used_numbers || bingo_numbers[i][j]; 
                    selected_numbers[i][j] := FALSE; 
                END IF;
            END LOOP;
        END LOOP;
    
        INSERT INTO bingo_cards (numbers, selected) VALUES (bingo_numbers, selected_numbers)
        RETURNING card_id INTO new_card_id;
    
        RETURN new_card_id;
    END;
    $$ LANGUAGE plpgsql;
    
    `);

    pgm.sql(`
    CREATE OR REPLACE FUNCTION generate_drawn_numbers(game_id_param INTEGER) RETURNS INTEGER AS $$
    DECLARE
        new_draw_id INTEGER;
        drawn_numbers_array INTEGER[] := '{}';
        max_number INT := 75;
        i INT;
        random_index INT;
    BEGIN
        
        drawn_numbers_array := drawn_numbers_array || 0;
    
        
        FOR i IN 1..max_number-1 LOOP
            
            LOOP
                random_index := FLOOR(RANDOM() * max_number) + 1;
                EXIT WHEN random_index <> ALL(drawn_numbers_array[2:]);
            END LOOP;
    
            
            drawn_numbers_array := drawn_numbers_array || random_index;
        END LOOP;
    
        
        INSERT INTO drawn_numbers (game_id, numbers, drawn_index) VALUES (game_id_param, drawn_numbers_array, 0)
        RETURNING draw_id INTO new_draw_id;

        RETURN new_draw_id;
    END;
    $$ LANGUAGE plpgsql;
    
    `)
  };
  